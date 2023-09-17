import { copyFileSync, lstatSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * should migrate to `nx` but until then, this is a quick way to maintain repository
 * @usage `ts-node multicopy.ts`
 */
const filenames = ['.prettierrc.js'];
const excludeDirs = ['.git', '.vscode', '.reference', 'node_modules'];

async function main() {
  for (const filename of filenames) {
    const workspaceRoot = join(process.cwd());
    const filePath = join(workspaceRoot, filename);
    readdirSync(workspaceRoot, { recursive: false }).forEach((folder) => {
      if (typeof folder !== 'string') {
        return;
      }
      const destDir = join(workspaceRoot, folder);
      if (lstatSync(destDir).isDirectory() && !excludeDirs.includes(destDir)) {
        const destPath = join(destDir, filename);
        copyFileSync(filePath, destPath);
      }
    });
  }
}

main();
