import type { FaviconContract } from '@unofficial-krds/contracts';
export type FaviconProps = FaviconContract;
/** React 19 hoists actual document metadata; no on-page asset placeholder. */
export function Favicon({ light, dark, touchIcon }: FaviconProps) { return <><link rel="icon" href={light.href} type={light.type} sizes={light.sizes} media={dark ? '(prefers-color-scheme: light)' : undefined}/>{dark && <link rel="icon" href={dark.href} type={dark.type} sizes={dark.sizes} media="(prefers-color-scheme: dark)"/>}{touchIcon && <link rel="apple-touch-icon" href={touchIcon.href} type={touchIcon.type} sizes={touchIcon.sizes}/>}</>; }
