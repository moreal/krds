import { createContext, useContext, type ReactNode } from 'react';

export type KrdsLocale = 'ko-KR' | 'en-US';
export interface KrdsProviderProps {
  locale?: KrdsLocale;
  direction?: 'ltr' | 'rtl';
  ownerDocument?: Document;
  children?: ReactNode;
}
const Context = createContext<Omit<KrdsProviderProps, 'children'>>({ locale: 'ko-KR', direction: 'ltr' });
/** Context is resolved during render; importing the package never touches the DOM. */
export function KrdsProvider({ children, ...props }: KrdsProviderProps) {
  const parent = useContext(Context);
  return <Context.Provider value={{ ...parent, ...props }}>{children}</Context.Provider>;
}
export function useKrdsEnvironment() {
  const context = useContext(Context);
  return { locale: context.locale ?? 'ko-KR', direction: context.direction ?? 'ltr', getDocument: () => context.ownerDocument ?? (typeof document === 'undefined' ? undefined : document) };
}
