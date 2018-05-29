const worklist = require("./workList.js");

const noticeMSG = {
  notSimbol: "해당 글자는 입력 할수 없는 기호입니다.",
  addTodo: " 항목이 추가 되었습니다.",
  updateTodo: " 항목으로 변경 되었습니다.",
  noneTodo: " 현재 등록된 항목이 없습니다."
};

// 시간 함수
function checkTime(commandTodo) {
  const splitTodo = commandTodo.split("$");
  const time = new Date();
  const nowTime = Date.now();
  const getMSTime = time.getTime();
  let calTime = 0;

  if (splitTodo[1] === "doing") {
    return getMSTime;
  } else if (splitTodo[1] === "done") {
    worklist.map(doingData => {
      if (Number(splitTodo[0]) === doingData.id) {
        // console.log("계산값:", doingData.time, "-", nowTime, "=", doingData.time - nowTime)
        calTime = Math.abs(nowTime - doingData.time);
      }
    });
    return calTime;
  }
}

// todo 추가
function addTodo(commandTodo) {
  const inputTodo = {
    id: worklist.length,
    name: commandTodo,
    time: 0,
    status: "todo"
  };
  worklist.push(inputTodo);

  const todoData = worklist.reduce((allAddData, addTodo) => {
    return addTodo.name;
  });

  const addTodoMSG = "todo 목록에 " + commandTodo + noticeMSG.addTodo;
  console.log(addTodoMSG);

  showStatus();
}

// todo 리스트 출력
function showTask(commandTodo) {
  worklist.forEach(workData => {
    if (commandTodo === workData.status) {
      // console.log(commandTodo === workData.status, commandTodo, workData.status)
      const message = workData.status + "목록에 id " + workData.id + ": " + workData.name;
      const doneMSG = message + " [ 소요시간: " + workData.time + "/ms ]";

      switch (commandTodo) {
        case "todo":
          console.log(message);
          return;
        case "doing":
          console.log(message);
          return;
        case "done":
          console.log(doneMSG);
          return;
      }
    }
  });
}

// todo 데이터 update 입/출력 함수
function updateTask(commandTodo) {
  const splitCommand = commandTodo.split("$");
  const idxTodo = Number(splitCommand[0]);
  const modifyTodo = splitCommand[1];
  const checkingTime = checkTime(commandTodo);

  Object.values(worklist).forEach(workData => {
    if (workData.id === idxTodo) {
      workData.status = modifyTodo;
      workData.time = checkingTime;
      const message = workData.status + "목록에 id " + workData.id + ": " + workData.name + noticeMSG.updateTodo;
      console.log(message);
    }
  });
  showStatus();
}


// 현재 todo list 출력 함수
function showStatus() {
  let todoList = 0;
  let doingList = 0;
  let doneList = 0;

  worklist.forEach(todoData => {
    if(todoData.status === "todo"){
      todoList++;
    } else if(todoData.status === "doing"){
      doingList++;
    } else if(todoData.status === "done"){
      doneList++;
    }
  });
  console.log(`현재상태 : todo: ${todoList}개, doing: ${doingList}개, done: ${doneList}개`);
}

// 명령이 입력 / 구분 함수
function inputCommand(inputWord) {
  for (let i = 0; i < inputWord.length; i++) {
    if (inputWord.indexOf("$") === -1) {
      console.log(noticeMSG.notSimbol);
      return;
    }
  }
  const splitCommand = inputWord.split(/\$/);

  switch (splitCommand[0]) {
    case "add":
      return addTodo(splitCommand[1]);
    case "show":
      return showTask(splitCommand[1]);
    case "update":
      return updateTask(splitCommand[1] + "$" + splitCommand[2]);
  }
}

inputCommand("add$자바스크립트 공부하기");
// inputCommand("show!가짜!"); // 해당 글자는 입력 할수 없는 기호입니다.
inputCommand("add$영어단어외우기");

// inputCommand("show$todo");
// inputCommand("show$doing");
// inputCommand("show$done");

// inputCommand("update$4$done"); // done 목록에 id 4: ooo 항목으로 변경 되었습니다.
// inputCommand("update$5$doing") // doing 목록에 id 5: ooo 항목으로 변경 되었습니다.
// inputCommand("update$5$done"); // done 목록에 id 5: ooo 항목으로 변경 되었습니다.
inputCommand("update$6$doing"); // doing 목록에 id 6: ooo 항목으로 변경 되었습니다.
// // console.log()


setTimeout(() => {
  inputCommand("update$6$done");
  inputCommand("show$todo");
  inputCommand("show$doing");
  inputCommand("show$done"); // [소요시간 3001~5 /ms] doing -> done 순차 변경시
}, 3000);

// inputCommand("update$1$done");
// inputCommand("show$doing");
// inputCommand("show$done");
// console.log()


// console.log(worklist);