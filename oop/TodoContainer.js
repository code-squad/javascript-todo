const CUD = {
  CREATE,
  UPDATE,
  DELETE,
}

class DiffState {
  constructor(op, value){
    this.op = op;
    this.value = value;
  }
}

class TodoContainer {
  constructor(size, contents = []){
    this._container = contents;
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

  insert(value){
    this._container.push(value);
    this._pushDiff(new DiffState(CUD.CREATE, value));
    this.flush();
  }

  remove(id) {
    const indexOfTarget = this._container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('삭제할 대상이 없습니다.');
    }

    this._pushDiff(new DiffState(CUD.DELETE, this._container[indexOfTarget]));
    this._container.splice(indexOfTarget);
    this.flush();
  }

  update(newStatus, id){
    const indexOfTarget = this._container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('변경할 대상이 없습니다.');
    }

    this._pushDiff(new DiffState(CUD.UPDATE, this._container[indexOfTarget]));
    this._container[indexOfTarget].status = newStatus;
    this.flush();
  }

  undo(){
    if(!this._diffContainer.length){
      throw new Error('히스토리가 존재하지 않습니다.');
    }

    const lastOp = this._diffContainer.pop();

    switch (lastOp.op) {
      case CUD.CREATE:
        this._container = this._container.filter(todo => todo.id !== lastOp.value.id );
        console.log(`${lastOp.value.id}번 항목 '${lastOp.value.name}'의 생성이 취소되었습니다.`);
        this._pushRedo(lastOp);
        break;
      case CUD.DELETE:
        this._container.push(lastOp.value);
        console.log(`${lastOp.value.id}번 항목 '${lastOp.value.name}'이 다시 생성되었습니다.`);
        this._pushRedo(lastOp);
        break;
      case CUD.UPDATE:
        const targetIdx = this._container.findIndex(todo => todo.id === lastOp.value.id );
        this._container[targetIdx].status = lastOp.value.status;
        console.log(`${lastOp.value.id}번 항목 '${lastOp.value.name}의 상태가 ${lastOp.value.status}로 복원되었습니다.`);
        this._pushRedo(lastOp);
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
        this.insert(redoOp.value);
        break;
      case CUD.DELETE:
        this.remove(redoOp.value.id);
        break;
      case CUD.UPDATE:
        this.update(redoOp.value.status, redo.value.id);
        break;
      default:
        break;
    }
  }
}

module.exports = TodoContainer;