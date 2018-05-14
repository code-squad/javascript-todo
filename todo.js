const noticeMSG = {
  notSimbol: "해당 글자는 입력 할수 없는 기호입니다.",
  addTodo: " 항목이 추가 되었습니다.",
};

let work = {
  todo: [],
  doing: ["3, 그래픽스 공부", "4, 알고리즘", "5, 수학공부", "6, 블로그쓰기"],
  done: ["7, 컴퓨터공학", "8, 데이터베이스"]
};

// todo 추가
function addTodo(commandTodo) {
  let inputTodo = work.todo.length+1 + ", " + commandTodo; 
  work.todo.push(inputTodo);
  let addTodoMSG = "";
  for(let i = 0; i < work.todo.length; i++){
    addTodoMSG = "todo 목록에 " + work.todo[i] + '"' + noticeMSG.addTodo;
  }
  console.log(addTodoMSG);

  showStatus();
}

// todo 리스트 출력
function showTask(commandTodo) {
  let command = commandTodo === "todo" || commandTodo === "doing" || commandTodo === "done"; 

  if(command){
    work[commandTodo].forEach(doingData => {
      let list = commandTodo + "목록에 id: " + doingData;
      console.log(list);
    });
  }
}

// 현재 todo list 출력 함수
function showStatus(){
  let todoList = work["todo"].length;
  let doingList = work["doing"].length;
  let doneList = work["done"].length;
  console.log(`현재상태  todo: ${todoList}개, doing: ${doingList}개, done: ${doneList}개`);
}

// 명령이 입력 / 구분 함수
function inputCommand(inputWord) {
  if (inputWord.indexOf("$") === -1) return console.log(noticeMSG.notSimbol);
  let splitCommand = inputWord.split(/\$/);

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