class currentStateData {
  constructor() {
    this.item = [];
    this.currentState = {
      todo: 0,
      doing: 0,
      done: 0
    }
  }

  command(message) {
    const [accessfn, accessMsg, accessMsg2] = message.split("$");
    if (accessfn === "add") return this.addData(accessMsg);
    else if (accessfn === "show") return this.showData(accessMsg);
    else if (accessfn === "update") return this.updateData(accessMsg2, parseInt(accessMsg));
  }
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
  }
  //addData함수의 결과를 출력해주는 함수.
  printData(dataId, dataTaskName) {
    const showTaskName = dataTaskName;
    console.log("현재 상태:", this.currentState);
    let returnMsg = `id: ${dataId}, "${showTaskName}" 항목이 새로 추가됐습니다.`;
    return returnMsg;
  }
  //원하는 item데이터(todo, doing, done) 보여주는 함수.
  showData(state) {
    let returnMsg = "";
    const temporaryStorage = this.item.filter(element => state === element.state)
    temporaryStorage.forEach((element) => {
      let msg = `ID: ${element.id}, taskName: ${element.taskName}, state: ${element.state}`;
      if (state === "todo" || state === "doing") {
        returnMsg += `${msg}\n`;
      }
      else if (state === "done") {
        returnMsg += `${msg}, leadTime: ${element.leadTime}\n`;
      }
    });
    return returnMsg;
  }
  //item 리스트(배열)에서 특정 id값을 찾아 해당하는 데이터의 state를 바꿔주는 함수.
  updateData(state, id) {
    let returnMsg = "";
    if (!this.checkState(state)) return returnMsg = `"${state}"는 올바르지 않은 state입니다. 올바른 state를 입력해주세요.`;
    else {
      this.item.filter(element => element.id === id).forEach((element) => {
        this.currentState[element.state]--;
        this.currentState[state]++;
        element.state = state;
        const leadTime = this.getLeadTime(element.leadTime);
        element.leadTime = leadTime;
        returnMsg = this.item;
      });
      return returnMsg;
    }
  }
  //updateData함수에서 받은 'state'의 인자값이 올바른지 아닌지 판별해주는 함수.
  checkState(state) {
    if (state === "doing" || state === "done") return true;
    else return false
  }
  //소요 시간 계산해주는 함수.
  //startTime의 초기 값은 0이다. state가 doing이 되는 시점에 startTime에 시간이 기록된다.
  getLeadTime(startTime) {
    return Date.now() - startTime;
  }
};

const todoApp = new currentStateData();
console.log(todoApp.command("add$자바스크립트 공부하기"));
console.log(todoApp.command("add$자바 공부하기"));
console.log(todoApp.command("update$1$doing"));
console.log(todoApp.command("update$1$done"));
console.log(todoApp.command("show$done"));