const Todo = require('./todo');
const ManagingTodo = require('./managingTodo');

const managingTodo = new ManagingTodo();

managingTodo.addTodo(new Todo('자바스크립트 공부하기', ['programming', 'javascript'], 'todo'));
managingTodo.addTodo(new Todo('그림 그리기', ['picture', 'favorite'], 'doing'));
managingTodo.addTodo(new Todo('꽃구경하기', ['flower', 'favorite'], 'done'));
managingTodo.addTodo(new Todo('저녁식사', ['dinner', 'food'], 'todo'));
managingTodo.addTodo(new Todo('커피마시기', ['coffee', 'favorite'], 'doing'));

console.log(managingTodo.showStatus('doing'));
console.log(managingTodo.showAll());
