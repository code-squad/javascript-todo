const noticeMSG = {
  notSimbol: "해당 글자는 입력 할수 없는 기호입니다.",
  addTodo: " 항목이 추가 되었습니다."
};

let work = {
  todo: [],
  doing: ["그래픽스 공부", "영어공부", "수학공부", "블로그쓰기"],
  done: ["컴퓨터공학", "데이터베이스"]
};

function addTodo(commandTodo) {
  work.todo.push(commandTodo);

  let findTodoData = searchTodo(commandTodo);

  let addTodoMSG = "id: " + indexVal + ", " + '"' + commandTodo + '"' + noticeMSG.addTodo;
  console.log(addTodoMSG);
  
  let todoListNum =
  "현재 상태:" +
  "todo: " + work.todo.length + "개" + ", " +
  "doing: " + work.doing.length + "개" + ", " +
  "done: " + work.done.length + "개";
  
  console.log(todoListNum);
}

function searchTodo(commandTodo) {
  for (let key in work) {
    work[key].forEach(todoData => {
      if (todoData === commandTodo) {
        let indexVal = work[key].indexOf(commandTodo) + 1;
        // 반환을 무엇을 해줄 것인가?? 
        // 필요한 반환 데이터 id (index값), 데이터의 value
        // 어떻게 찾을 데이터의 id/value값을 보내줄 것인가? => & 기호를 중간에 섞어서 id + & + value로 배열에 담아 반환
        // 반환된 데이터를 정제하려면  split("&") 기능으로 정제 및 분리 정제된 데이터를 출력하게 한다. 

      }
    });
  }
}

function showTask(commandTodo) {

}

function inputCommand(inputWord) {
  /*
  TODO:
  [O] 입력시 특정 기호를 구분자로 사용해 입력된 데이터를 추가한다.
  [] 데이터 추가시 id 값을 생성 한다.
  [] id생성 시 id값을 추가한다.
  */

  if (inputWord.indexOf("$") === -1) return console.log(noticeMSG.notSimbol);
  let splitData = inputWord.split("$");

  switch (splitData[0]) {
    case "add":
      return addTodo(splitData[1]);
    case "show":
      return showTask(splitData[1]);
    case "update":
      return updateTodo(splitData[1]);
  }
}

inputCommand("add$자바스크립트 공부하기");
// inputCommand("show!가짜!"); // 해당 글자는 입력 할수 없는 기호입니다.
inputCommand("show$doing");
inputCommand("show$done");