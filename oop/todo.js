function Todo(name, tags, status) {
  this.name = name;
  this.tags = tags;
  this.status = status;
  this.id = Todo.prototype.generateId();
}

Todo.prototype.id = 0;

Todo.prototype.generateId = function() {
  this.id += 1;
  return this.id;
};

module.exports = Todo;
