import type { HelpPlacement } from '@unofficial-krds/contracts';
interface AnchorBox { left: number; top: number; right: number; bottom: number; width: number; height: number; }
/** Pure geometry only; the owning Svelte component measures its actual native nodes. */
export function fitHelpPlacement(anchor: AnchorBox, popup: {width:number;height:number}, viewport: {width:number;height:number}, requested: HelpPlacement) {
    if (!['top-start','top','top-end','bottom-start','bottom','bottom-end'].includes(requested)) throw new TypeError('Unsupported help placement');
    const gap = 8;
    const suffix = requested.endsWith('-start') ? '-start' : requested.endsWith('-end') ? '-end' : '';
    let side = requested.startsWith('top') ? 'top' : 'bottom';
    const above = anchor.top - popup.height - gap;
    const below = anchor.bottom + gap;
    if (side === 'top' && above < gap && below + popup.height <= viewport.height - gap) side = 'bottom';
    else if (side === 'bottom' && below + popup.height > viewport.height - gap && above >= gap) side = 'top';
    const desiredLeft = suffix === '-start' ? anchor.left : suffix === '-end' ? anchor.right - popup.width : anchor.left + anchor.width / 2 - popup.width / 2;
    return {
        left: Math.max(gap, Math.min(desiredLeft, viewport.width - popup.width - gap)),
        top: Math.max(gap, Math.min(side === 'top' ? above : below, viewport.height - popup.height - gap)),
        placement: `${side}${suffix}` as HelpPlacement,
    };
}
