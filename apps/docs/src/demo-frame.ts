/** Frame height: never below the registry minHeight or the layout floor (overlay 640, inline 240), never above 1200. */
export function clampFrameHeight(record: { layout: 'inline' | 'overlay'; minHeight: number }, height: number): number {
 const floor = Math.max(record.layout === 'overlay' ? 640 : 240, Number.isFinite(record.minHeight) ? record.minHeight : 0);
 return Math.min(1200, Math.max(floor, Number.isFinite(height) ? height : floor));
}
