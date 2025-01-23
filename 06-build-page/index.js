const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');


fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
  console.log('Create project-dist-dir');
});

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, err => {
  if (err) throw err;
  console.log('Create assets dir');
});


replaceTags();
getFiles();
copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));



// HTML
async function replaceTags() {
  if (path.join(__dirname, 'project-dist').includes('index.html')) {
    fs.unlink(path.join(__dirname, 'project-dist', 'index.html'), err => {
      if (err) throw err;
    });
  }

  await fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));
  const componentsFiles = await fsPromises.readdir(path.join(__dirname, 'components'));

  for (const htmlFile of componentsFiles) {
    const template = await fsPromises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
    const htmlFileName = path.basename(htmlFile, path.extname(htmlFile));
    const htmlFileContent = await fsPromises.readFile(path.join(__dirname, 'components', htmlFile), 'utf-8');
    let replacedTag = template.replace(`{{${htmlFileName}}}`, htmlFileContent);
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), `${replacedTag}`);
  }
}



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


// ASSETS
async function copyAssets(src, dest) {
  const assetsFiles = await fsPromises.readdir(src, { withFileTypes: true });
  for (const file of assetsFiles) {
    if (file.isDirectory()) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      await copyAssets(srcPath, destPath);
    } else {
      await fsPromises.mkdir(dest, { recursive: true });
      await fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name));
    }
  }
}

