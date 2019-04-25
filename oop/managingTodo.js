const Todo = require('./todo');

function ManagingTodo(data, prompt, msg) {
  this.countedStatus = { todo: 0, doing: 0, done: 0 };
  this.managedlist = this.initManagedlist(data);
  this.msg = msg;
  this.prompt = prompt;
}

ManagingTodo.prototype.initManagedlist = function(data) {
  return data.map(todo => {
    const newTodo = new Todo(todo);
    this.countedStatus[newTodo.status] += 1;
    return newTodo;
  });
};

ManagingTodo.prototype.add = function(name, tags, status = 'todo') {
  const newTodo = new Todo({ name, tags, status });
  this.managedlist.push(newTodo);
  this.countedStatus[newTodo.status] += 1;

  this.printMsg(this.msg.add(newTodo.name, newTodo.id), 1000);
};

ManagingTodo.prototype.countStatus = function() {
  return Object.entries(this.countedStatus).reduce(
    (acc, cur) => (acc += `${cur[0]} : ${cur[1]}개 `),
    `현재상태 : `
  );
};

ManagingTodo.prototype.filterbyStatus = function(status = 'todo') {
  const filteredArrByStatus = this.managedlist
    .filter(todo => todo.status === status)
    .map(todo => todo.name);

  return `${status} 총 ${filteredArrByStatus.length}건 : ${filteredArrByStatus.join(', ')}`;
};

ManagingTodo.prototype.show = function(condition) {
  let outputStr = '';
  if (condition === 'all') {
    outputStr = this.countStatus();
  } else {
    outputStr = this.filterbyStatus(condition);
  }
  console.log(outputStr);
  this.prompt.prompt();
};

ManagingTodo.prototype.delete = function(id) {
  let outputMsg = '';

  if (typeof id === 'string') {
    id = parseInt(id);
  }

  this.managedlist = this.managedlist.filter(todo => {
    if (todo.id === id) {
      this.countedStatus[todo.status] -= 1;
      outputMsg = this.msg.delete(todo.name, todo.status);
      return false;
    }
    return true;
  });

  this.printMsg(outputMsg, 1000);
};

ManagingTodo.prototype.update = function(id, changeStatus) {
  if (typeof id === 'string') {
    id = parseInt(id);
  }
  const changeTodo = this.managedlist.find(todo => todo.id === id);

  this.countedStatus[changeTodo.status] -= 1;
  this.countedStatus[changeStatus] += 1;
  changeTodo.status = changeStatus;

  setTimeout(() => {
    this.printMsg(this.msg.update(changeTodo.name, changeStatus), 1000);
  }, 3000);
};

ManagingTodo.prototype.printMsg = function(msg, time) {
  console.log(msg);
  setTimeout(() => {
    this.show('all');
  }, time);
};
module.exports = ManagingTodo;
