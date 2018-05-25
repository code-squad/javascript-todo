const worklist = require("./workList.js");

const noticeMSG = {
  notSimbol: "해당 글자는 입력 할수 없는 기호입니다.",
  addTodo: " 항목이 추가 되었습니다.",
};


// 시간 함수
function checkTime(commandTodo) {
  const splitTodo = commandTodo.split("$");
  const time = new Date();
  const getMSTime = time.getMilliseconds();
  let calTime = 0;

  if (splitTodo[1] === "doing") {
    return getMSTime;
  } else if (splitTodo[1] === "done") {
    worklist.doing.map(doingData => {
      if (Number(splitTodo[0]) === doingData.id) {
        calTime = Math.abs(getMSTime - doingData.time);
      }
    });
    return calTime;
  }
}

// todo 추가
function addTodo(commandTodo) {
  // [] id값이 private 한 값으로 하도록 설계(추후)
  const inputTodo = { id: worklist.todo.length, name: commandTodo, time: 0 };
  worklist.todo.push(inputTodo);
  
  const todoData = worklist.todo.reduce((allAddData, addTodo) => {
    return addTodo.name;
  });
  
  const addTodoMSG = "todo 목록에 " + todoData + noticeMSG.addTodo;
  console.log(addTodoMSG);
  
  showStatus();
}

// todo 리스트 출력
function showTask(commandTodo) {
  worklist[commandTodo].forEach(workData => {
    const message = commandTodo + "목록에 id " + workData.id + ": " + workData.name;
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
  });
}


// todo 데이터 update 입/출력 함수
function updateTask(commandTodo) {
  const splitCommand = commandTodo.split("$");
  const idxTodo = Number(splitCommand[0]);
  const modifyTodo = splitCommand[1];
  const checkingTime = checkTime(commandTodo);

  Object.values(worklist).map(workData => {
    for (let key in workData) {
      if (workData[key].id === idxTodo) {
        worklist[modifyTodo].push({id: workData[key].id, name: workData[key].name, time: checkingTime });
        workData.splice(key, 1);
      }
    }
  });
  showStatus();
}


// 현재 todo list 출력 함수
function showStatus() {
  const todoList = worklist["todo"].length;
  const doingList = worklist["doing"].length;
  const doneList = worklist["done"].length;
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

// inputCommand("update$6$done");
inputCommand("update$1$doing");
inputCommand("update$1$done");

inputCommand("show$doing");
inputCommand("show$done");
inputCommand("update$done");

// console.log(worklist.todo);
// console.log(worklist.doing);
// console.log(worklist.done);