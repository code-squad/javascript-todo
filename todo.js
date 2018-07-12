const currentStateList = {
  todo: {
    idList: [],
    taskName: [],
    currentState: 0
  },
  doing: {
    idList: [],
    taskName: [],
    currentState: 0
  },
  done: {
    idList: [],
    taskName: [],
    currentState: 0
  },

  command(message) {
    const [accessfn, accessmessage] = message.split("$");
    if (accessfn === "add") return this.add(accessmessage)
    else if (accessfn === "show") return this.show(this[accessmessage])
    else if (accessfn === "update") return this.update(accessmessage)
  },

  add(taskName) {
    this.todo.taskName.push(taskName);
    let taskNameLength = this.todo.taskName.length;
    this.todo.idList.push(taskNameLength);
    this.todo.currentState = taskNameLength;
    let showIdList = this.todo.idList.slice(-1);
    let showTaskName = this.todo.taskName.slice(-1);
    return `id: ${showIdList}, "${showTaskName}" 항목이 새로 추가됐습니다.`;
  },

  show(state) {
    const showMessage = [];
    state.taskName.forEach((element, index) => {
      showMessage.push(`ID: ${state.idList[index]}, taskName: ${element}`)
    });
    return showMessage;
  },

  update() {
    return `todo: ${this.todo.currentState}, doing: ${this.doing.currentState}, done: ${this.done.currentState}`
  }
}

// console.log(currentStateList.command("add$자바스크립트 공부하기"));
// console.log(currentStateList.command("add$자바 공부하기"));
console.log(currentStateList.command("show$doing"));
// console.log(currentStateList.command("update$done"));