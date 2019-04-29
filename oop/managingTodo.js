const Todo = require('./todo');

class ManagingTodo {
  constructor({ data, inputPrompt, msgObj, todoError, history }) {
    this.countedStatus = { todo: 0, doing: 0, done: 0 };
    this.managedlist = this.initManagedlist(data);
    this.msgObj = msgObj;
    this.inputPrompt = inputPrompt;
    this.todoError = todoError;
    this.history = history;
  }

  initManagedlist(data) {
    return data.map(todo => {
      const newTodo = new Todo(todo);
      this.countedStatus[newTodo.status] += 1;
      return newTodo;
    });
  }

  add(name, tags = '[]', status = 'todo') {
    if (!this.todoError.invalidStatus(Object.keys(this.countedStatus), status)) {
      throw new Error(this.msgObj.getInvalidStatusError);
    }

    if (!this.todoError.isArray(tags)) {
      throw new Error(this.msgObj.getIsNotArrayError(tags));
    }

    tags = tags.replace(/[\[\]\"\'\s]/g, '').split(','); // 통과된 입력을 올바른 배열로 변환

    const newTodo = new Todo({ name, tags, status });

    this.managedlist.push(newTodo);
    this.countedStatus[newTodo.status] += 1;

    this.printMsg(this.msgObj.add(newTodo.name, newTodo.id), 1000);
  }

  countStatus() {
    return Object.entries(this.countedStatus).reduce(
      (acc, cur) => (acc += `${cur[0]} : ${cur[1]}개 `),
      `현재상태 : `
    );
  }

  filterbyStatus(status = 'todo') {
    const filteredArrByStatus = this.managedlist
      .filter(todo => todo.status === status)
      .map(todo => todo.name);

    return `${status} 총 ${filteredArrByStatus.length}건 : ${filteredArrByStatus.join(', ')}`;
  }

  show(status) {
    let outputStr = '';
    const searchStatusArr = ['all', ...Object.keys(this.countedStatus)];

    if (!this.todoError.invalidStatus(searchStatusArr, status)) {
      throw new Error(this.msgObj.getInvalidStatusError);
    }

    if (status === 'all') {
      outputStr = this.countStatus();
    } else {
      outputStr = this.filterbyStatus(status);
    }
    console.log(outputStr);
    this.inputPrompt.inputPrompt();
  }

  delete(id) {
    let outputMsg = '';
    let deletedId;

    if (typeof id === 'string') {
      id = parseInt(id);
    }

    this.managedlist = this.managedlist.filter(todo => {
      if (todo.id === id) {
        this.countedStatus[todo.status] -= 1;
        outputMsg = this.msgObj.delete(todo.name, todo.status);
        deletedId = todo.id;
        return false;
      }
      return true;
    });

    if (!this.todoError.invalidId(deletedId)) {
      throw new Error(this.msgObj.getInvalidIdError);
    }

    this.printMsg(outputMsg, 1000);
  }

  update(id, changeStatus) {
    if (typeof id === 'string') {
      id = parseInt(id);
    }

    const changeTodo = this.managedlist.find(todo => todo.id === id);
    const changeTodoId = changeTodo === undefined ? undefined : changeTodo.id;

    if (!this.todoError.invalidStatus(Object.keys(this.countedStatus), changeStatus)) {
      throw new Error(this.msgObj.getInvalidStatusError);
    }
    if (!this.todoError.invalidId(changeTodoId)) {
      throw new Error(this.msgObj.getInvalidIdError);
    }
    if (!this.todoError.compareStatus(changeTodo.status, changeStatus)) {
      throw new Error(this.msgObj.getSameStatusError(changeTodo.status, changeStatus));
    }

    this.countedStatus[changeTodo.status] -= 1;
    this.countedStatus[changeStatus] += 1;
    changeTodo.status = changeStatus;

    setTimeout(() => {
      this.printMsg(this.msgObj.update(changeTodo.name, changeStatus), 1000);
    }, 3000);
  }

  printMsg(msg, time) {
    console.log(msg);
    setTimeout(() => {
      this.show('all');
    }, time);
  }
}
module.exports = ManagingTodo;
