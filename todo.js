const currentStateData = {
  item: [],
  currentState: {
    todo: 0,
    doing: 0,
    done: 0
  },

  command(message) {
    const [accessfn, accessMsg, accessMsg2] = message.split("$");
    if (accessfn === "add") return this.addData(accessMsg);
    else if (accessfn === "show") return this.showData(accessMsg);
    else if (accessfn === "update") return this.updateData(accessMsg2, parseInt(accessMsg));
  },

  addData(taskName) {
    const startingIDVal = 1;
    const taskNameLength = this.item.length + startingIDVal;
    const dataSample = {
      id: taskNameLength,
      taskName: taskName,
      state: "todo",
    };
    const showId = dataSample.id;
    const showTaskName = dataSample.taskName;
    this.item.push(dataSample);
    this.currentState.todo++
    console.log("현재 상태:", this.currentState);
    return `id: ${showId}, "${showTaskName}" 항목이 새로 추가됐습니다.`;
  },

  showData(state) {
    const showMessage = [];
    this.item.forEach((element, index) => {
      if (element.state === state) showMessage.push(element);
    });
    return showMessage;
  },
  //item 리스트(배열)에서 특정 id값을 찾아 해당하는 데이터의 state를 바꿔주는 함수.
  updateData(state, id) {
    this.item.forEach((element) => {
      if (element.id === id) {
        this.currentState[element.state]--;
        this.currentState[state]++;
        element.state = state;
      };
    });
    console.log("현재 상태:", this.currentState);
    return this.item;
  },
};

console.log(currentStateData.command("add$자바스크립트 공부하기"));
console.log(currentStateData.command("add$자바 공부하기"));
console.log(currentStateData.command("show$todo"));
console.log(currentStateData.command("update$1$done"));