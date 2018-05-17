const noticeMSG = {
  notSimbol: "해당 글자는 입력 할수 없는 기호입니다.",
  addTodo: " 항목이 추가 되었습니다.",
};

const work = {
  todo: [],
  doing: ["3, 그래픽스 공부", "4, 알고리즘", "5, 수학공부", "6, 블로그쓰기"],
  done: ["7, 컴퓨터공학", "8, 데이터베이스"],
};

const times = {
  timeList: [11, 22]
};

// 시간 계산/데이터를 저장하게 하는 함수
/*
  구상:
  - 시간을 어떻게 계산하게 할것인가?
  - 계산된 시간을 어떻게 저장하게 하고 넘겨줄 것인가?
  - 넘겨받은 시간을 어떻게 계산하고 출력할 것인가?
*/

function checkStartTime(){
  const time = new Date();
  const getTime = time.getSeconds();

  return getTime;
}

// todo 추가
function addTodo(commandTodo) {
  let time = 0;
  if(commandTodo) time = checkStartTime();
  const inputTodo = work.todo.length+1 + ", " + commandTodo; 
  work.todo.push(inputTodo);
  times.timeList.push(time);

  const todoData = work.todo.reduce((allAddData, addTodo) => {
    return addTodo;
  });
  const addTodoMSG = "todo 목록에 " + todoData + '"' + noticeMSG.addTodo + "\n" + "시작시간: " + time;
  console.log(addTodoMSG);

  showStatus();
}

// todo 리스트 출력
function showTask(commandTodo) {
  let presentTime = new Date();
  let preTimeSec = presentTime.getSeconds();

  let time = times.timeList.reduce((acc, timeData) => {return timeData });
  work[commandTodo].forEach(doingData => {
    const list = commandTodo + "목록에 id: " + doingData;
    switch (commandTodo){
      case "todo":
        console.log(list);
        return;
      case "doing":
        console.log(list);
        return;
      case "done":
        console.log(list + "\n" + "소요시간:", preTimeSec-time);
        return;
    }
  });
}

// todo 데이터 update 입/출력 함수
function updateTask(idxTodo, modifyTodo){
  for(let key in work){
    work[key].forEach(todoData => {
      const split = todoData.split(/\,/);
      if(split[0] === idxTodo) {
        let find = work[key].indexOf(split[1])
        work[key].splice(find-1 , 1);
        work[modifyTodo].push(split[0] +  "," + split[1]);
      }
    });
  }

  showStatus();
}

// 현재 todo list 출력 함수
function showStatus(){
  const todoList = work["todo"].length;
  const doingList = work["doing"].length;
  const doneList = work["done"].length;
  console.log(`현재상태 :  todo: ${todoList}개, doing: ${doingList}개, done: ${doneList}개`);
}

// 명령이 입력 / 구분 함수
function inputCommand(inputWord) {
  if (inputWord.indexOf("$") === -1) {
    console.log(noticeMSG.notSimbol); 
    return;
  }
  const splitCommand = inputWord.split(/\$/);

  switch (splitCommand[0]) {
    case "add":
      return addTodo(splitCommand[1]);
    case "show":
      return showTask(splitCommand[1]);
    case "update":
      return updateTask(splitCommand[1], splitCommand[2]);
  }
}

inputCommand("add$자바스크립트 공부하기");
// // inputCommand("show!가짜!"); // 해당 글자는 입력 할수 없는 기호입니다.
inputCommand("add$영어단어외우기");

inputCommand("show$doing");
inputCommand("show$done");
inputCommand("show$todo");


inputCommand("show$done");
inputCommand("update$5$done");