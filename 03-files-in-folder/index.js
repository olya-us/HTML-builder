const fs = require('fs/promises');
const path = require('path');

(async function displayFilesInfo() {
    try {
        const folderPath = path.join(__dirname, 'secret-folder');
        const entries = await fs.readdir(folderPath, { withFileTypes: true });

        for (const entry of entries) {
        if (entry.isFile()) {
            const filePath = path.join(folderPath, entry.name);
            const stats = await fs.stat(filePath);

            const fileName = path.basename(entry.name, path.extname(entry.name));
            const fileExtension = path.extname(entry.name).slice(1);
            const fileSizeKB = stats.size;

            console.log(`${fileName} - ${fileExtension} - ${fileSizeKB}b`);
        }
        }
    } catch (error) {
        console.error(`Error reading files: ${error.message}`);
    }
})();