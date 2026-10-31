import {spawn, execFile} from 'node:child_process';
import {appendFileSync, mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

function processSnapshot() {
  return new Promise(resolve => {
    const unavailable = error => resolve({available: false, error, rows: []});
    try {
      // lstart plus command identifies retained PIDs across leader exit/reparenting.
      execFile('ps', ['-axo', 'pid,ppid,pgid,state,lstart,command'], {timeout: 1000, maxBuffer: 2 * 1024 * 1024}, (error, stdout, stderr) => {
        if (error) { unavailable(error.message || stderr); return; }
        const [header, ...lines] = stdout.trimEnd().split('\n');
        const rows = lines.filter(line => line.trim()).map(line => {
          const columns = line.trim().split(/\s+/);
          return {pid: Number(columns[0]), parent: Number(columns[1]), group: Number(columns[2]), state: columns[3], identity: columns.slice(4).join(' '), line};
        });
        resolve({available: true, header, rows});
      });
    } catch (error) { unavailable(error.message); }
  });
}
// Timeout cleanup discovers separate browser groups before signalling their owner.
export async function runCommand({command, args = [], cwd, env = process.env, timeoutMs, logPath, label, graceMs = 5000}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(graceMs) || graceMs < 0) throw new Error('A positive command timeout and bounded grace are required');
  graceMs = Math.min(graceMs, 5000);
  mkdirSync(dirname(logPath), {recursive: true});
  const startedAt = new Date().toISOString(); const started = Date.now();
  const diagnostics = {signals: [], signalTargets: [], processTree: '', trackedProcesses: [], discovery: {status: 'not-attempted', attempts: 0, errors: []}, cleanup: 'not-needed'};
  const emit = message => {
    for (const row of String(message).replace(/\r/g, '').split('\n')) {
      const line = `${new Date().toISOString()} [${label}] ${row}\n`;
      appendFileSync(logPath, line); process.stdout.write(line);
    }
  };
  emit(`started ${command} ${args.join(' ')}`);
  return await new Promise(resolve => {
    let child; let expired = false; let closed = false; let error; let deadlineTimer; let shuttingDown = false; let ancestryMissing = false;
    let latest; const tracked = new Map(); const knownGroups = new Set();
    const signal = (name, kind, id) => {
      const target = {signal: name, kind, id};
      try { process.kill(kind === 'group' ? -id : id, name); diagnostics.signals.push(name); target.status = 'sent'; }
      catch (e) { target.status = e.code === 'ESRCH' ? 'absent' : 'error'; if (target.status === 'error') target.error = e.message; }
      diagnostics.signalTargets.push(target);
    };
    const discover = async phase => {
      latest = await processSnapshot(); diagnostics.discovery.attempts++;
      if (!latest.available) {
        diagnostics.discovery.status = 'unavailable'; diagnostics.discovery.errors.push(`${phase}: ${latest.error}`);
        const message = `PID PPID PGID process-tree unavailable (${phase}): ${latest.error}`;
        diagnostics.processTree += `${message}\n`; emit(message); return;
      }
      if (diagnostics.discovery.status !== 'unavailable') diagnostics.discovery.status = 'available';
      if (phase === 'before-TERM' && !latest.rows.some(row => row.pid === child.pid)) ancestryMissing = true;
      // Retain identity matches after parents exit, then grow via ancestry and known
      // owned groups. A detached child's group is added only when its leader is ours.
      const selected = new Set(latest.rows.filter(row => tracked.get(row.pid)?.identity === row.identity).map(row => row.pid));
      selected.add(child.pid); knownGroups.add(child.pid);
      for (let changed = true; changed;) {
        changed = false;
        for (const row of latest.rows) if (selected.has(row.parent) || knownGroups.has(row.group) || selected.has(row.pid)) {
          if (!selected.has(row.pid)) { selected.add(row.pid); changed = true; }
          if (row.pid === row.group && !knownGroups.has(row.group)) { knownGroups.add(row.group); changed = true; }
        }
      }
      for (const row of latest.rows) if (selected.has(row.pid)) tracked.set(row.pid, row);
      diagnostics.trackedProcesses = [...tracked.values()].map(({pid, parent, group, identity}) => ({pid, parent, group, identity}));
      const tree = [latest.header, ...latest.rows.filter(row => selected.has(row.pid)).map(row => row.line)].join('\n');
      diagnostics.processTree += `${phase}:\n${tree}\n`; emit(`${phase}:\n${tree}`);
    };
    const signalTracked = name => {
      if (!latest?.available) {
        // Root PGID is always known. Previously captured groups/PIDs remain useful,
        // but unavailable discovery cannot establish detached-descendant coverage.
        for (const group of knownGroups) signal(name, 'group', group);
        if (!knownGroups.has(child.pid)) signal(name, 'group', child.pid);
        for (const pid of tracked.keys()) signal(name, 'pid', pid);
        return;
      }
      const alive = latest.rows.filter(row => tracked.get(row.pid)?.identity === row.identity);
      const ids = new Set(alive.map(row => row.pid));
      // Do not signal a foreign group containing unrelated processes; use owned PIDs.
      const groups = [...new Set(alive.map(row => row.group))].filter(group => group > 0 && latest.rows.filter(row => row.group === group).every(row => ids.has(row.pid)));
      for (const group of groups.sort((a, b) => Number(a === child.pid) - Number(b === child.pid))) signal(name, 'group', group);
      for (const row of alive) signal(name, 'pid', row.pid);
    };
    const finish = (exitCode, exitSignal) => {
      if (closed) return; closed = true;
      clearTimeout(deadlineTimer); process.off('SIGTERM', onTerm); process.off('SIGINT', onInt);
      const status = expired ? 'timed-out' : error || exitCode !== 0 ? 'failed' : 'passed';
      const completedAt = new Date().toISOString(); const durationMs = Date.now() - started;
      emit(`completed ${status} exit=${exitCode ?? 'null'} signal=${exitSignal ?? 'none'} durationMs=${durationMs}`);
      resolve({status, exitCode, signal: exitSignal, startedAt, completedAt, durationMs, pid: child?.pid, logPath, diagnostics, ...(error ? {error: error.message} : {})});
    };
    const cleanup = async immediate => {
      if (shuttingDown) return; shuttingDown = true; clearTimeout(deadlineTimer);
      // Three snapshots are individually capped at one second / 2 MiB. Collect
      // before TERM so an exiting owner cannot erase detached-child ancestry.
      await discover('before-TERM');
      signalTracked(immediate ? 'SIGKILL' : 'SIGTERM');
      if (!immediate) {
        await delay(graceMs);
        await discover('before-KILL');
        signalTracked('SIGKILL');
      }
      child.stdout.destroy(); child.stderr.destroy();
      await discover('after-KILL');
      const remaining = latest.available ? latest.rows.filter(row => tracked.get(row.pid)?.identity === row.identity && !row.state.startsWith('Z')).map(row => row.pid) : [];
      diagnostics.remainingProcesses = remaining;
      if (diagnostics.discovery.status === 'unavailable' || ancestryMissing) {
        diagnostics.cleanup = 'partial-discovery-unavailable';
        diagnostics.cleanupWarning = 'Cannot verify cleanup of all detached descendants: process discovery or original ancestry was unavailable. Only known groups/PIDs were signalled.';
      } else if (remaining.length || diagnostics.signalTargets.some(target => target.status === 'error')) {
        diagnostics.cleanup = 'partial-tracked-processes-remain';
        diagnostics.cleanupWarning = 'Cannot verify complete detached-descendant cleanup: tracked processes remain or signalling failed.';
      } else diagnostics.cleanup = 'tracked-processes-terminated';
      emit(`cleanup=${diagnostics.cleanup}${diagnostics.cleanupWarning ? ` ${diagnostics.cleanupWarning}` : ''}`);
      finish(child.exitCode, child.signalCode);
    };
    const interrupted = name => {
      error = new Error(`Interrupted by ${name}`); emit(error.message);
      // Also clean independently detached descendants if a bounded verifier itself
      // is interrupted by the outer worker's timeout.
      void cleanup(true);
    };
    const onTerm = () => interrupted('SIGTERM'); const onInt = () => interrupted('SIGINT');
    try { child = spawn(command, args, {cwd, env, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe']}); }
    catch (e) { error = e; finish(null, null); return; }
    process.on('SIGTERM', onTerm); process.on('SIGINT', onInt);
    emit(`pid=${child.pid ?? 'unavailable'} process-group=${child.pid ?? 'unavailable'}`);
    child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
    child.stdout.on('data', chunk => emit(chunk.toString().replace(/\n$/, '')));
    child.stderr.on('data', chunk => emit(chunk.toString().replace(/\n$/, '')));
    child.on('error', e => { error = e; });
    child.on('close', (code, sig) => { if (!shuttingDown) finish(code, sig); });
    deadlineTimer = setTimeout(() => {
      expired = true; emit(`timed-out after ${timeoutMs}ms; collecting process tree (browser/server/child commands)`);
      void cleanup(false);
    }, timeoutMs);
  });
}
