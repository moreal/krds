/** Docs metadata is evidence, not a declaration of native component support. */
export interface CompilerExampleEvidence {
  framework: string;
  sourcePath: string;
  sourceSha256: string;
  componentIds: readonly string[];
  status: 'compiler-checked';
  command: string;
  evidencePaths: readonly string[];
  publicPackageConsumption: true;
  checkpointOnly: true;
  currentCandidate: false;
  notes: readonly string[];
  proofInputs: readonly DocsSourceInput[];
  consumedArtifact?: { path: string; sha256: string };
}

export interface DocsSourceInput {
  path: string;
  bytes: number;
  sha256: string;
}
