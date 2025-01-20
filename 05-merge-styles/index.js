const fs = require('fs/promises');
const path = require('path');

let arr = [];

async function getFiles() {
  const allFiles = await fs.readdir(path.join(__dirname, 'styles'));
  const styleFiles = allFiles.filter(file => path.extname(file).toString() === '.css');

  for (const file of styleFiles) {
    const fileData = await fs.readFile(path.join(__dirname, 'styles', file), 'utf-8');
    arr.push(fileData);
  }

  const projectFiles = await fs.readdir(path.join(__dirname, 'project-dist'));
  if (projectFiles.includes('bundle.css')) {
    fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'));
  }

  arr.forEach(el => {
    fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), el);
  })
}

getFiles();