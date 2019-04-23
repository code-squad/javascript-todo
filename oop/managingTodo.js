function ManagingTodo() {
  this.managedlist = [];
}

ManagingTodo.prototype.addTodo = function(todo) {
  this.managedlist.push(todo);
};

ManagingTodo.prototype.showAll = function() {
  const countedStatus = this.managedlist.reduce((acc, cur) => {
    acc[cur.status] = acc.hasOwnProperty(cur.status) ? acc[cur.status] + 1 : 1;
    return acc;
  }, {});

  return Object.entries(countedStatus).reduce(
    (acc, cur) => (acc += `${cur[0]} : ${cur[1]}개 `),
    `현재상태 : `
  );
};

ManagingTodo.prototype.showStatus = function(status = 'todo') {
  const filteredByStatus = this.managedlist
    .filter(todo => todo.status === status)
    .map(todo => todo.name);

  return `총 ${filteredByStatus.length}건 : ${filteredByStatus.join(', ')}`;
};

module.exports = ManagingTodo;
