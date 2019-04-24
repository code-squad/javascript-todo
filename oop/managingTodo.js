function ManagingTodo() {
  this.managedlist = [];
  this.countedStatus = { todo: 0, doing: 0, done: 0 };
}

ManagingTodo.prototype.addTodo = function(todo) {
  this.managedlist.push(todo);
  this.countedStatus[todo.status] += 1;
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
};

ManagingTodo.prototype.delete = function(id) {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  this.managedlist = this.managedlist.filter(todo => {
    if (todo.id === id) {
      this.countedStatus[todo.status] -= 1;
      return false;
    }
    return true;
  });

  this.show('all');
};

module.exports = ManagingTodo;
