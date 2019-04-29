const CUD = {
  CREATE: "insert",
  UPDATE: "update",
  DELETE: "delete",
}

class DiffState {
  constructor(op, todo, prop, value){
    this.op = op;
    this.todo = todo;
    this.prop = prop;
    this.value = value;
  }
}

class TodoContainer {
  constructor(size, contents = []){
    this.container = contents;
    this._diffContainer = [];
    this._redoContainer = [];
    this._size = size;
  }

  _pushDiff(diff){
    if(this._diffContainer.length === this._size){
      this._diffContainer.shift();
    }
    this._diffContainer.push(diff);
  }

  _pushRedo(diff){
    if(this._redoContainer.length === this._size){
      this._redoContainer.shift();
    }
    this._redoContainer.push(diff);
  }

  flush(){
    this._redoContainer = [];
  }

  insert(todo){
    this.container.push(todo);
    this._pushDiff(new DiffState(CUD.CREATE, todo));
    console.log(`${todo.name}이/가 추가되었습니다. (id: ${todo.id})`);
  }

  remove(id) {
    const indexOfTarget = this.container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('삭제할 대상이 없습니다.');
    }

    this._pushDiff(new DiffState(CUD.DELETE, this.container[indexOfTarget]));
    this.container.splice(indexOfTarget, 1);

    console.log(`${id}번 항목이 삭제되었습니다.`);
  }

  update(id, newStatus){
    const indexOfTarget = this.container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('변경할 대상이 없습니다.');
    }

    if(this.container[indexOfTarget].status === newStatus){
      throw new Error(`${id}번 ${this.container[indexOfTarget].name}은/는 이미 ${newStatus} 상태입니다.`);
    }

    this._pushDiff(new DiffState(CUD.UPDATE, this.container[indexOfTarget], "status", this.container[indexOfTarget].status));
    this.container[indexOfTarget].status = newStatus;
    console.log(`${id}번 ${this.container[indexOfTarget].name}의 상태가 ${newStatus}로 변경되었습니다.`);
  }

  undo(){
    if(!this._diffContainer.length){
      throw new Error('히스토리가 존재하지 않습니다.');
    }

    const lastOp = this._diffContainer.pop();

    switch (lastOp.op) {
      case CUD.CREATE:
        this.container = this.container.filter(todo => todo.id !== lastOp.todo.id );
        console.log(`${lastOp.todo.id}번 항목 '${lastOp.todo.name}'의 생성이 취소되었습니다.`);
        break;
      case CUD.DELETE:
        this.container.push(lastOp.todo);
        console.log(`${lastOp.todo.id}번 항목 '${lastOp.todo.name}'이 다시 생성되었습니다.`);
        break;
      case CUD.UPDATE:
        const targetIdx = this.container.findIndex(todo => todo.id === lastOp.todo.id );
        const tmp = this.container[targetIdx].status;
        this.container[targetIdx].status = lastOp.value;
        lastOp.value = tmp;
        console.log(`${lastOp.todo.id}번 항목 '${lastOp.todo.name}의 상태가 ${this.container[targetIdx].status}로 복원되었습니다.`);
        break;
      default:
        break;
    }
    this._pushRedo(lastOp);
  }

  redo(){
    if(!this._redoContainer.length){
      throw new Error('프로그램이 최신 상태입니다.');
    }

    const redoOp = this._redoContainer.pop();

    switch (redoOp.op) {
      case CUD.CREATE:
        this.insert(redoOp.todo);
        break;
      case CUD.DELETE:
        this.remove(redoOp.todo.id);
        break;
      case CUD.UPDATE:
        this.update(redoOp.todo.id, redoOp.value);
        break;
      default:
        break;
    }
  }
}

module.exports = TodoContainer;