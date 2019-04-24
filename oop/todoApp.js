class TodoApp {
  constructor(){
    // this._todoList = require('./todoList.js');
    this._todoList = [{id:1}, {id:2}, {id:5}];

    this._init = function () {
      this._todoList.sort((lhs, rhs) => lhs.id < rhs.id );
      this._lastUsedId = this._todoList[this._todoList.length - 1].id + 1;
    }

    this._init();

    this._uniqueIdGenerator = ( () => {
      var nextId = this._lastUsedId;
      return function(){
        return nextId++;
      }
    })();
  }

  add(name, status){
    
  }

  delete(id){

  }

  show(status){

  }

  update(id, status){

  }

}

module.exports = TodoApp;