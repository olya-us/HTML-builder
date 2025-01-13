const fs = require('fs/promises');
const path = require('path');
const pathFiles = path.join(__dirname, 'files');
const copyFiles = path.join(__dirname, 'files-copy');

async function copy(src, dest) {
  try {
    await fs.rm(dest, { force: true, recursive: true });
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (entry.isDirectory()) {
        await copy(srcPath, destPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

copy(pathFiles, copyFiles);