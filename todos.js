const data = require('./data');
const Todo = require('./todo');

const todo = new Todo(data);

todo.show('status', 'all');
todo.show('status', 'todo');
todo.show('status', 'doing');
todo.show('status', 'done');
todo.show('tag', 'favorite');
todo.show('tag', 'food');
todo.show('tag', 'javascript');
