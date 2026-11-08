import type { ArtifactManifest, Definitions, SourceBinding } from './contract';
export interface ArtifactModules {
  identity: ArtifactManifest['identity'];
  inputs: ArtifactManifest['modules'];
}
export function writeArtifactManifest(options: { framework: string; outputDir: string; bindings: SourceBinding[]; modules: ArtifactModules; definitions: Definitions; root?: string }): ArtifactManifest;
