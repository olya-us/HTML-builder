const fs = require('fs');
const path = require('path');
const { mkdir, readdir, readFile, writeFile, rm, copyFile } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(projectDist, 'assets');

async function buildPage() {
    try {
        await rm(projectDist, { recursive: true, force: true });
        await mkdir(projectDist, { recursive: true });

        await generateHTML();

        await mergeStyles();

        await copyAssets(assetsDir, distAssetsDir);

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Error during build:', error.message);
    }
}

async function generateHTML() {
    try {
        let template = await readFile(templatePath, 'utf-8');
        const components = await readdir(componentsDir, { withFileTypes: true });

        for (const component of components) {
            const componentExt = path.extname(component.name);
            const componentName = path.basename(component.name, componentExt);

            if (component.isFile() && componentExt === '.html') {
                const componentPath = path.join(componentsDir, component.name);
                const componentContent = await readFile(componentPath, 'utf-8');
                const tag = `{{${componentName}}}`;
                template = template.replace(new RegExp(tag, 'g'), componentContent);
            }
        }

        await writeFile(path.join(projectDist, 'index.html'), template);
    } catch (error) {
        console.error('Error generating HTML:', error.message);
    }
}

async function mergeStyles() {
    try {
        const outputStyle = path.join(projectDist, 'style.css');
        const writeStream = fs.createWriteStream(outputStyle, { flags: 'w' });

        const styleFiles = await readdir(stylesDir, { withFileTypes: true });

        for (const file of styleFiles) {
            const filePath = path.join(stylesDir, file.name);
            if (file.isFile() && path.extname(file.name) === '.css') {
                const readStream = fs.createReadStream(filePath, 'utf-8');
                readStream.pipe(writeStream, { end: false });

                readStream.on('error', (err) =>
                    console.error(`Error reading style file ${file.name}:`, err.message),
                );
            }
        }
    } catch (error) {
        console.error('Error merging styles:', error.message);
    }
}

async function copyAssets(srcDir, destDir) {
    try {
        await mkdir(destDir, { recursive: true });

        const items = await readdir(srcDir, { withFileTypes: true });
        for (const item of items) {
            const srcPath = path.join(srcDir, item.name);
            const destPath = path.join(destDir, item.name);

            if (item.isDirectory()) {
                await copyAssets(srcPath, destPath);
            } else if (item.isFile()) {
                await copyFile(srcPath, destPath);
            }
        }
    } catch (error) {
        console.error('Error copying assets:', error.message);
    }
}

buildPage();