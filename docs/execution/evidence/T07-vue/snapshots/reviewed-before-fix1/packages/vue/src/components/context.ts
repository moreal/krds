import { computed, defineComponent, inject, provide, type InjectionKey, type PropType, type ComputedRef } from 'vue';
export interface KrdsContext {
    locale: ComputedRef<'ko-KR' | 'en-US'>;
    direction: ComputedRef<'ltr' | 'rtl'>;
    document: () => Document | undefined;
}
const key: InjectionKey<KrdsContext> = Symbol('KRDS Vue context');
export const KrdsProvider = defineComponent({ name: 'KrdsProvider', props: { locale: { type: String as PropType<'ko-KR' | 'en-US'>, default: 'ko-KR' }, direction: { type: String as PropType<'ltr' | 'rtl'>, default: 'ltr' }, document: Function as PropType<() => Document | undefined> }, setup(props, { slots }) { provide(key, { locale: computed(() => props.locale), direction: computed(() => props.direction), document: () => props.document?.() ?? (typeof document === 'undefined' ? undefined : document) }); return () => slots.default?.(); } });
export function useKrds() { return inject(key, { locale: computed(() => 'ko-KR' as const), direction: computed(() => 'ltr' as const), document: () => typeof document === 'undefined' ? undefined : document }); }
