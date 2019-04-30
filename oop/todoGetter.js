class TodoGetter {
  constructor(msg){
    this.msg = msg;
  }
  getTodoIndex(todos, id) {
    const index = todos.findIndex(el => el.id === id*1);
    this.isValidId(index, id)
    return index
  }
  getTodoById (todos, id) {
    return todos[this.getTodoIndex(todos, id)]
  }
  isValidId (index, id) {
    if(index < 0) throw new Error(this.msg.invalidId(id))
  }
  isValidStatus (statusToChange, status){
    if(statusToChange === status) throw new Error(this.msg.sameStatus())
  }
}

module.exports = TodoGetter