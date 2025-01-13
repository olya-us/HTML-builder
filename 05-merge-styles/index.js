const fs = require('fs');
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');

async function merge() {
  try {
    const output = fs.createWriteStream(pathToProject, { flags: 'w' });

    const files = await fs.promises.readdir(pathToStyles, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(pathToStyles, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const input = fs.createReadStream(filePath, 'utf-8');

        input.pipe(output, { end: false });

        input.on('error', (err) => console.error(`Error reading file ${file.name}:`, err.message));
      }
    }

    console.log('Styles merged successfully into bundle.css');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

merge();