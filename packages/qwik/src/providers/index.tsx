import { component$, createContextId, Slot, useContext, useContextProvider, useStore, useTask$, type JSXChildren } from '@builder.io/qwik';
import type { Locale } from '../internal/behavior';
export interface KrdsEnvironment {
    locale: Locale;
    direction: 'ltr' | 'rtl';
}
const environment = createContextId<KrdsEnvironment>('unofficial-krds.environment');
/** The owning element determines the document; no global DOM access occurs at import. */
export function useKrdsEnvironment(): KrdsEnvironment { return useContext(environment, { locale: 'ko-KR', direction: 'ltr' } as KrdsEnvironment); }
export interface KrdsProviderProps {
    locale?: Locale;
    direction?: 'ltr' | 'rtl';
    children?: JSXChildren;
}
export const KrdsProvider = component$<KrdsProviderProps>((props) => {
    const state = useStore<KrdsEnvironment>({ locale: props.locale ?? 'ko-KR', direction: props.direction ?? 'ltr' });
    useTask$(({ track }) => {
        const locale = track(() => props.locale) ?? 'ko-KR', direction = track(() => props.direction) ?? 'ltr';
        if (!['ko-KR', 'en-US'].includes(locale) || !['ltr', 'rtl'].includes(direction))
            throw new TypeError('Invalid KRDS environment');
        state.locale = locale;
        state.direction = direction;
    });
    useContextProvider(environment, state);
    return <div lang={state.locale} dir={state.direction}><Slot /></div>;
});
