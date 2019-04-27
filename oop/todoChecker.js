function TodoChecker (msg) {
  this.msg = msg;
}

TodoChecker.prototype = {
  getTodoIndex: function (todos, id) {
    const index = todos.findIndex(el => el.id === id*1);
    this.isValidId(index, id)
    return index
  },
  getTodoById : function (todos, id) {
    return todos[this.getTodoIndex(todos, id)]
  },
  isValidId: function (index, id) {
    if(index < 0) throw new Error(this.msg.invalidId(id))
  },
  isValidStatus: function (statusToChange, status){
    if(statusToChange === status) throw new Error(this.msg.sameStatus())
  }
}

module.exports = TodoChecker