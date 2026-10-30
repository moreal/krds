import { createContext, useContext, type Accessor, type JSX } from 'solid-js';

export type KrdsLocale = 'ko-KR' | 'en-US';
export interface KrdsProviderProps {
  locale?: KrdsLocale;
  direction?: 'ltr' | 'rtl';
  /** Optional document used by native portal and focus operations. */
  ownerDocument?: Document;
  children: JSX.Element;
}

export interface KrdsEnvironment {
  locale: Accessor<KrdsLocale>;
  direction: Accessor<'ltr' | 'rtl'>;
  /** Resolved lazily: importing this package never reads browser globals. */
  getDocument: () => Document | undefined;
}

const defaultEnvironment: KrdsEnvironment = {
  locale: () => 'ko-KR',
  direction: () => 'ltr',
  getDocument: () => typeof document === 'undefined' ? undefined : document,
};
const KrdsContext = createContext<KrdsEnvironment>(defaultEnvironment);

/** Native Solid context; adds no wrapper DOM, CSS, fonts or global mutation. */
export function KrdsProvider(props: KrdsProviderProps) {
  const inherited = useContext(KrdsContext);
  const environment: KrdsEnvironment = {
    locale: () => props.locale ?? inherited.locale(),
    direction: () => props.direction ?? inherited.direction(),
    getDocument: () => props.ownerDocument ?? inherited.getDocument(),
  };
  return <KrdsContext.Provider value={environment}>{props.children}</KrdsContext.Provider>;
}

/** Component locale props take precedence over this context's locale. */
export function useKrdsEnvironment(): KrdsEnvironment {
  return useContext(KrdsContext);
}
