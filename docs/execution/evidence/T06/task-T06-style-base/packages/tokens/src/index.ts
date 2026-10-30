/** Public generated token records retain original KRDS keys, values and aliases. */
export interface NormalizedToken {
  readonly value: string;
  readonly type: 'color' | 'dimension' | 'text';
  readonly description?: string;
  readonly cssName: string;
  readonly references: readonly string[];
  readonly resolvedValue: string;
}
