const fs = require('fs');
const path = require('path');

const readibleStream = fs.ReadStream(path.join(__dirname, "text.txt"), 'utf-8');

readibleStream.on('error', (error) => console.log('Error'));
readibleStream.on('data', (chunk) => console.log(chunk));
