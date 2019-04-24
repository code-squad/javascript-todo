// const readline = require('readline');
// const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const TodoParser = require('./todoParser');
const todoParser = new TodoParser('$');

// rl.setPrompt("> ");
// rl.prompt();

// rl.on('line', line => {
//   const commandObj = todoParser.parsing(line);

//   if(commandObj.command === 'exit'){
//     rl.close();
//   }

//   rl.prompt();
// }).on('close', () => {
//   process.exit(0);
// });

let line = '';

line = 'add$1$name';

const commandObj = todoParser.parsing(line);