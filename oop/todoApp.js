const Todo = require('./todo');
const TodoContainer = require('./TodoContainer');
const { countByProp } = require('./util');
const CUD = require('./CUD');

var TodoApp = function(){
  this.init();
}

TodoApp.prototype = {
  init: function(size){
    loadList = require('./todoList');
    loadList.sort((lhs, rhs) => lhs.id < rhs.id );
    this._lastUsedId = loadList[loadList.length - 1].id + 1;

    this._todoList = new TodoContainer(loadList);

    this._diffContainer = [];
    this._redoContainer = [];

    this._uniqueIdGenerator = ( () => {
      var nextId = this._lastUsedId;
      return function(){
        return nextId++;
      }
    })();
  },

  _pushDiff: function(diff){
    if(this._diffContainer.length === this._size){
      this._diffContainer.shift();
    }
    this._diffContainer.push(diff);
    },
    
  _pushRedo: function(diff){
    if(this._redoContainer.length === this._size){
      this._redoContainer.shift();
    }
    this._redoContainer.push(diff);
    },

  _redoFlush: function(){
      this._redoContainer = [];
  },

  exec: function({command, args}){
    const manipulationCommand = ['add', 'delete', 'update'];
    this[command](...args);
    if(manipulationCommand.some(mCommand => command === mCommand)){
      this._redoFlush();
    }
  },

  add: function(name, tag, status, id) {
    const diffState = this._todoList.insert(new Todo(id ? id : this._uniqueIdGenerator(), name, JSON.parse(tag), status));
    this._pushDiff(diffState);
  },

  delete: function(id){
    const diffState = this._todoList.remove(id);
    this._pushDiff(diffState);
  },

  update: function(id, newStatus) {
    const diffState = this._todoList.update(id, newStatus);
    this._pushDiff(diffState);
  },

  show: function(status){
    if(status === "all"){
      const countGroupByStatus = countByProp(this._todoList.container, "status");

      console.log(`현재 상태 : ${Object.entries(countGroupByStatus)
                                     .map(status => `${status[0]} : ${status[1]}`)
                                     .join(', ')}`);
    } else {
      const filteredTodoNames = this._todoList.container.filter(todo => todo.status === status)
                                              .map(todo => todo.name);

      console.log(`${status} 리스트 : 총 ${filteredTodoNames.length}건 : ${filteredTodoNames.join(', ')}`);
    }
  },

  findTodoByKey: function(key, value){
    return this._todoList.findIndex(todo => todo[key] === value) !== -1;
  },

  findTodoById: function(id){
    return this.findTodoByKey("id", id);
  },

  undo: function(){
    if(!this._diffContainer.length){
      throw new Error('히스토리가 존재하지 않습니다.');
    }

    const lastOp = this._diffContainer.pop();

    switch (lastOp.op) {
      case CUD.CREATE:
        this._todoList.remove(lastOp.todo.id);
        break;
      case CUD.DELETE:
        this._todoList.insert(lastOp.todo);
        break;
      case CUD.UPDATE:
        const diffState = this._todoList.update(lastOp.todo.id, lastOp.value);
        lastOp.value = diffState.value;
        break;
      default:
        break;
    }
    this._pushRedo(lastOp);
  },

  redo: function(){
    if(!this._redoContainer.length){
      throw new Error('프로그램이 최신 상태입니다.');
    }

    const redoOp = this._redoContainer.pop();
    const redoTodo = redoOp.todo;

    switch (redoOp.op) {
      case CUD.CREATE:
        this.add(redoTodo.name, JSON.stringify(redoTodo.tag), redoTodo.status, redoTodo.id);
        break;
      case CUD.DELETE:
        this.delete(redoOp.todo.id);
        break;
      case CUD.UPDATE:
        this.update(redoOp.todo.id, redoOp.value);
        break;
      default:
        break;
    }
  }, 

}

module.exports = TodoApp;