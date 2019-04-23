const Todo = require('./todo');
const ManagingTodo = require('./managingTodo');

const managingTodo = new ManagingTodo();

managingTodo.addTodo(new Todo('꽃구경하기', ['flower', 'favorite'], 'done'));
managingTodo.addTodo(new Todo('저녁식사', ['dinner', 'food'], 'todo'));
managingTodo.addTodo(new Todo('저녁식사', ['dinner', 'food'], 'todo'));
managingTodo.addTodo(new Todo('저녁식사', ['dinner', 'food'], 'todo'));

console.log(managingTodo.showStatus('todo'));
console.log(managingTodo.showAll());
