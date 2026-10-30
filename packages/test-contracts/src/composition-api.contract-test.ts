/** Compile-only public contract consumer in an existing dependent workspace. No runtime renderer or coverage. */
import type { HeaderContract, MainMenuContract, RadioGroupContract, RadioGroupOption, SelectOption, OpenChangeDetails } from '@unofficial-krds/contracts';
type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
export type RadioOptionId = Assert<Equal<RadioGroupOption['id'], string | undefined>>;
export type RadioConsumesOwnSubtype = Assert<Equal<RadioGroupContract['options'][number], RadioGroupOption>>;
export type SelectIdentityUnchanged = Assert<Equal<Extract<keyof SelectOption, 'id'>, never>>;
export type HeaderCurrent = Assert<Equal<HeaderContract['currentId'], string | undefined>>;
export type HeaderMobileControlled = Assert<Equal<HeaderContract['mobileOpen'], boolean | undefined>>;
export type HeaderMobileDefault = Assert<Equal<HeaderContract['defaultMobileOpen'], boolean | undefined>>;
export type HeaderMobileRequest = Assert<Equal<Parameters<NonNullable<HeaderContract['onMobileOpenChange']>>, [OpenChangeDetails]>>;
export type HeaderTriggerIdentity = Assert<Equal<HeaderContract['mobileTriggerId'], string | undefined>>;
export type HeaderTriggerName = Assert<Equal<HeaderContract['mobileTriggerLabel'], string | undefined>>;
export type HeaderNavigationName = Assert<Equal<HeaderContract['navigationLabel'], string | undefined>>;
export type MainMenuName = Assert<Equal<MainMenuContract['label'], string | undefined>>;
export type MainMenuTriggerIdentity = Assert<Equal<MainMenuContract['mobileTriggerId'], string | undefined>>;
export type MainMenuTriggerName = Assert<Equal<MainMenuContract['mobileTriggerLabel'], string | undefined>>;
