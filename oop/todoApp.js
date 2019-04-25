const Todo = require('./todo');

var TodoApp = function(){
  this.init();
}

TodoApp.prototype = {
  init: function(){
    this._todoList = require('./todoList.js');

    this._todoList.sort((lhs, rhs) => lhs.id < rhs.id );
    this._lastUsedId = this._todoList[this._todoList.length - 1].id + 1;

    this._uniqueIdGenerator = ( () => {
      var nextId = this._lastUsedId;
      return function(){
        return nextId++;
      }
    })();
  },

  add: function(name, tag, status){
    this._todoList.push(new Todo(this._uniqueIdGenerator(), name, JSON.parse(tag), status));
  },

  delete: function(id){
    if(!this.findTodoById(id)){
      throw new Error('존재하지 않는 ID입니다.');
    }
    this._todoList = this._todoList.filter(todo => todo.id !== id );
  },

  show: function(status){
    if(status === "all"){
      const seperatedObj = this._todoList.reduce((acc, todo) => {
                                                                  acc[todo.status] = acc[todo.status] + 1 || 1;
                                                                  return acc;
                                                                } , {});
      console.log(`현재 상태 : ${Object.entries(seperatedObj)
                                     .map(status => `${status[0]} : ${status[1]}`)
                                     .join(', ')}`);
    } else {
      const filterResult = this._todoList.filter(todo => todo.status === status)
                                    .reduce((acc, todo) => { acc.cnt++;
                                                             acc.msg.push(todo.name);
                                                             return acc;
                                                            } , {cnt: 0, msg: []});

      console.log(`${status} 리스트 : 총 ${filterResult.cnt}건 : ${filterResult.msg.join(', ')}`);
    }
  },

  update: function(id, newStatus){
    if(!this.findTodoById(id)){
      throw new Error('존재하지 않는 ID입니다.');
    }

    const targetTodo = this._todoList.find(todo => todo.id === Number.parseInt(id));
    const idxOfTargetTodo = this._todoList.findIndex(todo => todo.id === id);
    
    if(targetTodo.status === newStatus){
      throw new Error(`${id}번 todo는 이미 ${newStatus} 상태입니다.`);
    }

    targetTodo.status = newStatus;
    this._todoList[idxOfTargetTodo] = targetTodo;
  },

  findTodoByKey: function(key, value){
    return this._todoList.findIndex(todo => todo[key] === value) !== -1;
  },

  findTodoById: function(id){
    return this.findTodoByKey("id", id);
  }

}

module.exports = TodoApp;