const fsPromises = require('fs/promises');
const path = require('path');


fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

// HTML
fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));

async function replaceTags() {
  const componentsFiles = await fsPromises.readdir(path.join(__dirname, 'components'));

  for (const htmlFile of componentsFiles) {
    const template = await fsPromises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
    const htmlFileName = path.basename(htmlFile, path.extname(htmlFile));
    const htmlFileContent = await fsPromises.readFile(path.join(__dirname, 'components', htmlFile), 'utf-8');
    let replacedTag = template.replace(`{{${htmlFileName}}}`, htmlFileContent);
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), `${replacedTag}`);
  }
}

replaceTags();


// CSS
let arr = [];

async function getFiles() {
  const allFiles = await fsPromises.readdir(path.join(__dirname, 'styles'));
  const styleFiles = allFiles.filter(file => path.extname(file).toString() === '.css');

  for (const file of styleFiles) {
    const fileData = await fsPromises.readFile(path.join(__dirname, 'styles', file), 'utf-8');
    arr.push(fileData);
  }

  const projectFiles = await fsPromises.readdir(path.join(__dirname, 'project-dist'));
  if (projectFiles.includes('style.css')) {
    fsPromises.unlink(path.join(__dirname, 'project-dist', 'style.css'));
  }

  arr.forEach(el => {
    fsPromises.appendFile(path.join(__dirname, 'project-dist', 'style.css'), el);
  })
}

getFiles();

// ASSETS
fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

async function copyAssets(src, dest) {
  const assetsFiles = await fsPromises.readdir(src, { withFileTypes: true });
  for (const file of assetsFiles) {
    if (file.isDirectory()) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      copyAssets(srcPath, destPath);
    } else {
      fsPromises.mkdir(dest, { recursive: true });
      fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name));
    }
  }
}

copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
