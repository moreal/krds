import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
/** Geometry only: each native component owns its popup DOM and interaction. */
export function usePopupPosition(open: Ref<boolean>, trigger: Ref<HTMLElement | undefined>, popup: Ref<HTMLElement | undefined>, requested: () => string) {
    const placement = ref(requested());
    const style = ref<Record<string, string>>({
        position: 'fixed', left: '16px', top: '16px',
        right: 'auto', bottom: 'auto', transform: 'none',
    });
    let alive = false;
    let frame = 0;
    let resize: ResizeObserver | undefined;
    function measure() {
        if (!alive || !open.value || !trigger.value || !popup.value)
            return;
        const anchor = trigger.value.getBoundingClientRect();
        const box = popup.value.getBoundingClientRect();
        const gap = 8;
        const area = { left: 16, top: 16, right: innerWidth - 16, bottom: innerHeight - 16 };
        for (let parent = popup.value.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            const css = getComputedStyle(parent);
            if (/auto|scroll|hidden|clip/.test(css.overflowX + ' ' + css.overflowY)) {
                const clip = parent.getBoundingClientRect();
                area.left = Math.max(area.left, clip.left + 8);
                area.right = Math.min(area.right, clip.right - 8);
                area.top = Math.max(area.top, clip.top + 8);
                area.bottom = Math.min(area.bottom, clip.bottom - 8);
            }
        }
        const wanted = requested();
        const [side, align] = wanted.split('-');
        let actual = side;
        if (side === 'top' && anchor.top - box.height - gap < area.top && anchor.bottom + box.height + gap <= area.bottom)
            actual = 'bottom';
        if (side === 'bottom' && anchor.bottom + box.height + gap > area.bottom && anchor.top - box.height - gap >= area.top)
            actual = 'top';
        if (side === 'left' && anchor.left - box.width - gap < area.left)
            actual = 'right';
        if (side === 'right' && anchor.right + box.width + gap > area.right)
            actual = 'left';
        const rtl = getComputedStyle(trigger.value).direction === 'rtl';
        const alignment = rtl ? align === 'start' ? 'end' : align === 'end' ? 'start' : align : align;
        let left = alignment === 'start' ? anchor.left : alignment === 'end' ? anchor.right - box.width : anchor.left + (anchor.width - box.width) / 2;
        let top = actual === 'top' ? anchor.top - box.height - gap : anchor.bottom + gap;
        if (actual === 'left' || actual === 'right') {
            left = actual === 'left' ? anchor.left - box.width - gap : anchor.right + gap;
            top = anchor.top + (anchor.height - box.height) / 2;
        }
        left = Math.max(area.left, Math.min(left, Math.max(area.left, area.right - box.width)));
        top = Math.max(area.top, Math.min(top, Math.max(area.top, area.bottom - box.height)));
        // A transformed ancestor can establish the fixed containing block.
        // Convert the viewport delta back into the actual CSS coordinate space.
        const css = getComputedStyle(popup.value);
        const scaleX = popup.value.offsetWidth ? box.width / popup.value.offsetWidth : 1;
        const scaleY = popup.value.offsetHeight ? box.height / popup.value.offsetHeight : 1;
        const x = (parseFloat(css.left) || 0) + (left - box.left) / (scaleX || 1);
        const y = (parseFloat(css.top) || 0) + (top - box.top) / (scaleY || 1);
        placement.value = actual + (align ? '-' + align : '');
        style.value = {
            position: 'fixed', left: `${x}px`, top: `${y}px`,
            right: 'auto', bottom: 'auto', transform: 'none',
            maxWidth: `${Math.max(1, area.right - area.left) / (scaleX || 1)}px`,
            maxHeight: `${Math.max(1, area.bottom - area.top) / (scaleY || 1)}px`,
        };
    }
    function schedule() {
        if (frame)
            cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { frame = 0; measure(); });
    }
    async function bind() {
        await nextTick();
        if (!alive)
            return;
        resize?.disconnect();
        if (open.value) {
            resize = new ResizeObserver(schedule);
            if (trigger.value)
                resize.observe(trigger.value);
            if (popup.value)
                resize.observe(popup.value);
            measure();
            schedule();
        }
    }
    watch([open, requested], bind, { flush: 'post' });
    onMounted(() => {
        alive = true;
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);
        void bind();
    });
    onUnmounted(() => {
        alive = false;
        if (frame)
            cancelAnimationFrame(frame);
        resize?.disconnect();
        window.removeEventListener('resize', schedule);
        window.removeEventListener('scroll', schedule, true);
    });
    return { style, placement };
}
