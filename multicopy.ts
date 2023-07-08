import { copyFileSync, lstatSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * should migrate to `nx` but until then, this is a quick way to maintain repository
 * @useage `ts-node multicopy.ts`
 */
const filename = '.prettierrc.js';

const workspaceRoot = join(process.cwd());
const filePath = join(workspaceRoot, filename);
const exclude = ['.git', '.vscode', 'node_modules'];
readdirSync(workspaceRoot, { recursive: false }).forEach((folder) => {
  if (typeof folder !== 'string') {
    return;
  }
  const destDir = join(workspaceRoot, folder);
  if (lstatSync(destDir).isDirectory() && !exclude.includes(destDir)) {
    const destPath = join(destDir, filename);
    copyFileSync(filePath, destPath);
  }
});
