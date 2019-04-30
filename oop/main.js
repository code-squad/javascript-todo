const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const TodoParser = require('./todoParser');
const todoParser = new TodoParser('$');
const TodoApp = require('./todoApp');
const todoApp = new TodoApp();

rl.setPrompt("명령하세요: ");
rl.prompt();

rl.on('line', line => {
  rl.pause();
  try{
    const commandObj = todoParser.parsing(line);
    todoApp.exec(commandObj);
  } catch (err){
    console.error(err.message);
  } finally{
    rl.prompt();
    rl.resume();
  }
}).on('close', () => {
  process.exit(0);
});