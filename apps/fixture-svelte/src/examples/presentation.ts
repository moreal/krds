import { demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections } from '@unofficial-krds/test-contracts/patterns';
export { demoIdentity, formCategories, resourceCategories, consentContent, layoutSections };
export function layoutHref(caseId: string, id: string) { return `/examples/service-layout?${new URLSearchParams({ case: caseId, section: id })}`; }
export function navigation(caseId: string) { return layoutNavigation.map(group => ({ ...group, children: group.children?.map(item => ({ ...item, href: layoutHref(caseId, item.id) })) })); }
