const Todo = require('./todo');
const TodoContainer = require('./TodoContainer');

Array.prototype.groupBy = function(prop) {
  return this.reduce((groups, element) => {
    var value = element[prop];
    groups[value] = groups[value] || [];
    groups[value].push(value);
    return groups;
  }, {});
};

Object.prototype.count = function(){
  return Object.keys(this).reduce((groups, prop) => {
    groups[prop] = (this[prop] instanceof Array ? this[prop].length : 1 );
    return groups; 
  }, {});
};

var TodoApp = function(){
  this.init();
}

TodoApp.prototype = {
  init: function(){
    loadList = require('./todoList');
    loadList.sort((lhs, rhs) => lhs.id < rhs.id );
    this._lastUsedId = loadList[loadList.length - 1].id + 1;

    this._todoList = new TodoContainer(3, loadList);

    this._uniqueIdGenerator = ( () => {
      var nextId = this._lastUsedId;
      return function(){
        return nextId++;
      }
    })();
  },

  add: function(name, tag, status){
    this._todoList.insert(new Todo(this._uniqueIdGenerator(), name, JSON.parse(tag), status));
    this._todoList.flush();
  },

  delete: function(id){
    this._todoList.remove(id);
    this._todoList.flush();
  },

  show: function(status){
    if(status === "all"){
      const countGroupByStatus = this._todoList.container.groupBy("status").count();

      console.log(`현재 상태 : ${Object.entries(countGroupByStatus)
                                     .map(status => `${status[0]} : ${status[1]}`)
                                     .join(', ')}`);
    } else {
      const filteredTodoNames = this._todoList.container.filter(todo => todo.status === status)
                                              .map(todo => todo.name);

      console.log(`${status} 리스트 : 총 ${filteredTodoNames.length}건 : ${filteredTodoNames.join(', ')}`);
    }
  },

  update: function(id, newStatus){
    this._todoList.update(id, newStatus);
    this._todoList.flush();
  },

  findTodoByKey: function(key, value){
    return this._todoList.findIndex(todo => todo[key] === value) !== -1;
  },

  findTodoById: function(id){
    return this.findTodoByKey("id", id);
  },

  undo: function(){
    this._todoList.undo();
  },

  redo: function(){
    this._todoList.redo();
  },

}

module.exports = TodoApp;