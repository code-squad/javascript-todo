const data = require('../data');
const ManagingTodo = require('./managingTodo');

const readline = require('readline');

const inputPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const managingTodo = new ManagingTodo(data, inputPrompt);

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

// managingTodo.addTodo(data);
// managingTodo.addTodo(new Todo('자바스크립트 공부하기', ['programming', 'javascript'], 'todo'));
// managingTodo.addTodo(new Todo('그림 그리기', ['picture', 'favorite'], 'doing'));
// managingTodo.addTodo(new Todo('꽃구경하기', ['flower', 'favorite'], 'done'));
// managingTodo.addTodo(new Todo('저녁식사', ['dinner', 'food'], 'todo'));
// managingTodo.addTodo(
//   new Todo({ name: '커피마시기', tags: ['coffee', 'favorite'], status: 'doing' })
// );

// managingTodo.show('all');
// managingTodo.show('todo');
// managingTodo.show('doing');
// managingTodo.delete(1);
// managingTodo.update('3', 'doing');
