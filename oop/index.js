const data = require('../data');
const ManagingTodo = require('./managingTodo');
const MSG = require('./msg');

const readline = require('readline');

const inputPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const msg = new MSG();
const managingTodo = new ManagingTodo(data, inputPrompt, msg);

console.log('0을 입력하면 프로그램이 종료됩니다.');
inputPrompt.setPrompt('명령하세요 : ');
inputPrompt.prompt();

inputPrompt.on('line', message => {
  if (message === '0') {
    inputPrompt.close();
  }
  const userInput = message.split('$');
  const methodName = userInput.splice(0, 1);

  managingTodo[methodName](...userInput);
});

inputPrompt.on('close', () => {
  process.exit();
});
