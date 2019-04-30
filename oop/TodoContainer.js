const CUD = require('./CUD');
const DiffState = require('./diffState');

class TodoContainer {
  constructor(contents = []){
    this.container = contents;
  }

  insert(todo){
    this.container.push(todo);
    console.log(`${todo.name}이/가 추가되었습니다. (id: ${todo.id})`);
    return new DiffState(CUD.CREATE, todo);
  }

  remove(id) {
    const indexOfTarget = this.container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('삭제할 대상이 없습니다.');
    }

    const targetTodo = this.container[indexOfTarget];
    this.container.splice(indexOfTarget, 1);
    console.log(`${id}번 항목이 삭제되었습니다.`);

    return new DiffState(CUD.DELETE, targetTodo);
  }

  update(id, newStatus){
    const indexOfTarget = this.container.findIndex(todo => todo.id === id);

    if(indexOfTarget === -1){
      throw new Error('변경할 대상이 없습니다.');
    }

    if(this.container[indexOfTarget].status === newStatus){
      throw new Error(`${id}번 ${this.container[indexOfTarget].name}은/는 이미 ${newStatus} 상태입니다.`);
    }


    const lastStatus = this.container[indexOfTarget].status;
    this.container[indexOfTarget].status = newStatus;
    console.log(`${id}번 ${this.container[indexOfTarget].name}의 상태가 ${newStatus}로 변경되었습니다.`);
    return new DiffState(CUD.UPDATE, this.container[indexOfTarget], "status", lastStatus);
  }
}

module.exports = TodoContainer;