// A quarantine is an explicit unsupported capability, never a failed required gate.
export function quarantinedStorybooks(testing) {
  return (testing.unsupportedOrSeparate ?? []).flatMap(row => {
    const ci = row.storybook?.ci;
    if (!ci) return [];
    if (ci.status !== 'quarantined-unsupported-preview' || ci.project !== `storybook-${row.framework}` || !ci.reason?.trim() || row.storybook.status !== 'pending-preview-validation') throw new Error('Invalid unsupported Storybook quarantine');
    if (testing.requiredStorybookFrameworks.includes(row.framework)) throw new Error('Required Storybook cannot be quarantined');
    const alternatives = ci.requiredAlternativeTargets;
    if (!alternatives || !['build', 'typecheck'].every(target => alternatives[`krds-${row.framework}`]?.includes(target)) || !['build', 'typecheck', 'contract'].every(target => alternatives[`fixture-${row.framework}`]?.includes(target))) throw new Error('Quarantine requires package and native fixture alternative targets');
    return [{...ci, framework: row.framework}];
  });
}
