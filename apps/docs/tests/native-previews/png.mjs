import { inflateSync } from 'node:zlib';
/**
 * Minimal decoder for the 8-bit RGB/RGBA PNGs Playwright writes. Returns the number of distinct
 * colours (capped) and the share of pixels that differ from the most common colour, so a capture
 * that is a single flat colour (an unpainted compositor frame) can be rejected.
 */
export function pngStats(buffer, { cap = 4096 } = {}) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let offset = 8, width = 0, height = 0, depth = 0, type = 0; const data = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset), kind = buffer.toString('latin1', offset + 4, offset + 8), body = buffer.subarray(offset + 8, offset + 8 + length);
    if (kind === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); depth = body[8]; type = body[9]; if (body[12]) throw new Error('interlaced PNG unsupported'); }
    if (kind === 'IDAT') data.push(body);
    if (kind === 'IEND') break;
    offset += 12 + length;
  }
  const channels = { 2: 3, 6: 4 }[type];
  if (depth !== 8 || !channels) throw new Error(`unsupported PNG depth ${depth}/type ${type}`);
  const raw = inflateSync(Buffer.concat(data)), stride = width * channels;
  let previous = Buffer.alloc(stride); const counts = new Map();
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? line[i - channels] : 0, b = previous[i], c = i >= channels ? previous[i - channels] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      line[i] = (line[i] + [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][filter]) & 255;
    }
    for (let x = 0; x < stride; x += channels) { const key = line.readUIntBE(x, 3); if (counts.size < cap || counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1); }
    previous = line;
  }
  const dominant = Math.max(...counts.values());
  return { width, height, colors: counts.size, varied: 1 - dominant / (width * height) };
}
/** A painted docs/preview capture has text and controls: many colours and a non-trivial share of non-background pixels. */
export const isBlank = stats => stats.colors < 16 || stats.varied < 0.005;
/**
 * Screenshot once layout is stable across animation frames, and re-capture (bounded) while Chromium
 * still returns an unpainted frame after a viewport change. Fails if the capture stays blank.
 */
export async function paintedScreenshot(page, path, { attempts = 10 } = {}) {
  await page.evaluate(() => new Promise(done => { let last = -1, steady = 0; const tick = () => { const h = document.documentElement.scrollHeight; steady = h === last ? steady + 1 : 0; last = h; if (steady >= 2) done(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const buffer = await page.screenshot({ path });
    const stats = pngStats(buffer);
    if (!isBlank(stats)) return { ...stats, attempts: attempt, bytes: buffer.length };
    await page.waitForTimeout(100 * attempt);
  }
  throw new Error(`blank capture ${path}`);
}
