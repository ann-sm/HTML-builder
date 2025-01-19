const fs = require('fs');
const path = require('path');

const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("start", () => console.log('Hello! Print something here...'));
emitter.emit("start"); 

const readline = require('readline');
const { stdin: input, stdout: output } = process;
const RL = readline.createInterface({ input, output });

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
})

RL.on('line', (input) => {
  if (input.toString().trim().toLowerCase() === 'exit') endRL();
  fs.appendFile(path.join(__dirname, 'text.txt'), `${input}\n`, (err) => {
    if (err) throw err;
  })
})

RL.on('SIGINT', () => endRL())

const endRL = () => {
  console.log('Bye!');
  fs.unlink(path.join(__dirname, 'text.txt'), (err) => {
    if (err) throw err;
  });
  RL.close();
  process.exit();
}