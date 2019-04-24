function ManagingTodo() {
  this.managedlist = [];
}

ManagingTodo.prototype.addTodo = function(todo) {
  this.managedlist.push(todo);
};

ManagingTodo.prototype.countStatus = function() {
  const countedStatusObj = this.managedlist.reduce((acc, cur) => {
    acc[cur.status] = acc.hasOwnProperty(cur.status) ? acc[cur.status] + 1 : 1;
    return acc;
  }, {});

  return Object.entries(countedStatusObj).reduce(
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

module.exports = ManagingTodo;
