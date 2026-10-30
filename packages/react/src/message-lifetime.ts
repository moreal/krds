import { useEffect, useRef } from 'react';
/** Visibility remains host owned. Each meaningful generation requests one timeout. */
export function useMessageLifetime(signature: string | null, duration: number | null, onTimeout: (generation: number) => void) {
  const sequence = useRef(0);
  const previous = useRef<string | null>(null);
  if (previous.current !== signature) { previous.current = signature; sequence.current++; }
  const generation = sequence.current;
  const latest = useRef(onTimeout);
  latest.current = onTimeout;
  const paused = useRef(false);
  const control = useRef<{pause:()=>void;resume:()=>void} | null>(null);
  useEffect(() => {
    if (!signature || duration === null) return;
    if (!Number.isFinite(duration) || duration <= 0) throw new RangeError('Message duration must be positive.');
    let remaining = duration;
    let started = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;
    let fired = false;
    const pause = () => {
      if (timer === undefined) return;
      clearTimeout(timer); timer = undefined;
      remaining = Math.max(0, remaining - (performance.now() - started));
    };
    const resume = () => {
      if (!alive || fired || timer !== undefined || document.hidden || paused.current) return;
      started = performance.now();
      timer = setTimeout(() => {
        timer = undefined;
        if (alive && !fired && sequence.current === generation) { fired = true; latest.current(generation); }
      }, remaining);
    };
    control.current = {pause,resume};
    const visibility = () => { if (document.hidden) pause(); else resume(); };
    resume(); document.addEventListener('visibilitychange',visibility);
    return () => { alive = false; pause(); control.current = null; document.removeEventListener('visibilitychange',visibility); };
  }, [signature,generation,duration]);
  const setPaused = (next:boolean) => { paused.current=next; if(next)control.current?.pause();else control.current?.resume(); };
  return {generation,setPaused};
}
