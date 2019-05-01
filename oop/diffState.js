class DiffState {
  constructor(op, todo, prop, value){
    this.op = op;
    this.todo = todo;
    this.prop = prop;
    this.value = value;
  }
}

module.exports = DiffState;