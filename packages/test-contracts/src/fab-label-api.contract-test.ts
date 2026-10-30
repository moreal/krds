/** Compile-only consumer of the public package; no renderer or coverage claim. */
import type { FABContract } from '@unofficial-krds/contracts';

type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

export type OptionalLabelPresentation = Assert<Equal<FABContract['showLabel'], boolean | undefined>>;
export type AccessibleLabelStillRequired = Assert<Equal<Pick<FABContract, 'label'>, { label: string }>>;

export const iconOnly = { label: '새 신청', icon: 'plus', showLabel: false } satisfies FABContract;
export const visibleLabel = { label: '새 신청', icon: 'plus', showLabel: true } satisfies FABContract;
export const retainedDefault = { label: '새 신청', icon: 'plus' } satisfies FABContract;

// @ts-expect-error Presentation accepts a boolean, never a behavior variant string.
export const invalidPresentation = { label: '새 신청', icon: 'plus', showLabel: 'single-icon' } satisfies FABContract;
// @ts-expect-error An icon-only visual presentation still requires an accessible label.
export const missingAccessibleLabel = { icon: 'plus', showLabel: false } satisfies FABContract;
