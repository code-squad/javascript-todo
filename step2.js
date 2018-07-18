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
  //item에 todo를 추가해주는 함수
  addData(taskName) {
    const startingIDVal = 1;
    const taskNameLength = this.item.length + startingIDVal;
    const dataSample = {
      id: taskNameLength,
      taskName: taskName,
      state: "todo",
      leadTime: 0
    };
    this.item.push(dataSample);
    this.currentState.todo++;
    const returnMsg = this.printData(dataSample.id, dataSample.taskName);
    return returnMsg;
  },
  //addData함수의 결과를 출력해주는 함수.
  printData(dataId, dataTaskName) {
    const showId = dataId;
    const showTaskName = dataTaskName;
    console.log("현재 상태:", this.currentState);
    returnMsg = `id: ${showId}, "${showTaskName}" 항목이 새로 추가됐습니다.`;
    return returnMsg;
  },
  //원하는 item데이터(todo, doing, done) 보여주는 함수.
  showData(state) {
    let returnMsg = "";
    const accordData = this.item.filter(element => state === element.state)
    accordData.forEach((element) => {
      if (state === "todo" || state === "doing") {
        returnMsg += `ID: ${element.id}, taskName: ${element.taskName}, state: ${element.state}\n`;
      }
      else if (state === "done") {
        returnMsg += `ID: ${element.id}, taskName: ${element.taskName}, state: ${element.state}, leadTime: ${element.leadTime}\n`;
      }
    });
    return returnMsg;
  },
  //item 리스트(배열)에서 특정 id값을 찾아 해당하는 데이터의 state를 바꿔주는 함수.
  updateData(state, id) {
    let returnMsg = "";
    if (this.checkState(state)) {
      this.item.filter(element => element.id === id).forEach((element) => {
        this.currentState[element.state]--;
        this.currentState[state]++;
        element.state = state;
        const leadTime = this.getLeadTime(element.state, element.leadTime);
        element.leadTime = leadTime;
      });
      returnMsg = this.item;
    } else return returnMsg = `"${state}"는 올바르지 않은 state입니다. 올바른 state를 입력해주세요.`;

    return returnMsg;
  },
  //updateData함수에서 받은 'state'의 인자값이 올바른지 아닌지 판별해주는 함수.
  checkState(state) {
    if (state === "doing" || state === "done") return true;
    else return false
  },
  //소요 시간 계산해주는 함수.
  getLeadTime(state, initLeadTime) {
    if (state === "doing") return Date.now();
    else if (state === "done") return Date.now() - initLeadTime;
  },
};

console.log(currentStateData.command("add$자바스크립트 공부하기"));
console.log(currentStateData.command("add$자바 공부하기"));
console.log(currentStateData.command("update$1$doing"));
console.log(currentStateData.command("update$1$done"));
console.log(currentStateData.command("show$done"));
// console.log(currentStateData.command("show$done"));

