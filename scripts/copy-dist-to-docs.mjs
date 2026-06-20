import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Use current working directory as project root (script is invoked from project root)
const root = process.cwd();
const src = path.join(root, 'dist');
const dest = path.join(root, 'docs');

async function copyDir(srcDir, destDir) {
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    await copyDir(src, dest);
    console.log('Copied dist -> docs');
  } catch (err) {
    console.error('Failed to copy dist to docs:', err);
    process.exit(1);
  }
})();
