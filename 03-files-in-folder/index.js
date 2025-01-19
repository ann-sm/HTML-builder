const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = path.basename(file.name, path.extname(file.name));
      const fileExt = path.extname(file.name).slice(1);
      fs.stat(path.join(file.parentPath, file.name), (err, stats) => {
        if (err) throw err;
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExt} - ${fileSize}B`);
      })
    }
  });
})