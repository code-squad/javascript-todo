const Todo = require('./todo');
const ManagingTodo = require('./managingTodo');
const data = require('../data');
const managingTodo = new ManagingTodo();

managingTodo.addTodo(data);
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
managingTodo.delete(1);
managingTodo.update('3', 'doing');
