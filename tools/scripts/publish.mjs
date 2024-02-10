/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 * You might need to authenticate with NPM before running this script.
 *
 * @example nx run @nestjs-tools/cloudinary:publish --args=--version=0.0.2,--tag=latest
 */

import { readFileSync, writeFileSync } from 'fs';

import devkit from '@nx/devkit';

function invariant(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const defaultTag = 'next';
const [, , name, version, _tag] = process.argv;
const tag = (_tag === 'undefined' ? undefined : _tag) ?? defaultTag;

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;

invariant(
  version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`,
);

const graph = devkit.readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
);

const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured correctly?`,
);

process.chdir(outputPath);

// Updating the version in "package.json" before publishing
try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  json.version = version;
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (error) {
  console.error(error);
  console.error(`Error reading package.json file from library build output.`);
}

// Execute "npm publish" to publish
// execSync(`npm publish --access public --tag ${tag}`);

// manually run publishing command when OTP is set
console.log(`Go to build output directory, and run publish command`);
console.warn('------------------------------------------------');
console.warn(`cd ${devkit.workspaceRoot}`);
console.warn(`cd ${outputPath}`);
console.warn(`npm publish --access public --tag ${tag}`);
console.warn(`cd ${devkit.workspaceRoot}`);
console.warn('------------------------------------------------');
