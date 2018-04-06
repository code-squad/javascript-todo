// Todo App
// 나의 할 일을 관리하는 어플리케이션
//
// # 사용방법
// command(인자1$인자2)의 형식으로 입력한다 (update는 command(인자1$인자2$인자3)이다)
// 인자1에는 명령을 입력한다, add, show, update가 있다 
// 
// # 명령별 동작
// 1. add : 인자2에 할 일을 입력하면 todo상태에 등록된다
// 예를 들어 command(add$자바스크립트 공부)를 입력하면 id값이 할당되고 todo에 추가된다
// 2. show : 인자2에 내가 보고 싶은 상태를 입력하면 입력된 상태에 있는 목록이 출력된다
// 예를 들어 command(show$doing)을 입력하면 doing상태의 목록이 [1] 자바공부 [2] 산책하기 와 같이 출력된다
// 3. update : 내가 추가한 할 일의 상태를 변경시킨다
// 예를 들어 command(update$2$done)을 입력하면 id값이 2인 할 일을 done상태로 만들어준다

let todoList = {
  todo: {},
  doing: {},
  done: {}
};

const mainCommand = {
  add: addTodo,
  show: showSelectedStatus,
  update: updateTodo,
  getId: (function () {
    let id = 0;
    return function () {
      id++;
      return id;
    }
  })()
};
const errorMsg = {
  notCommand: cmd => `${cmd}는 입력 커맨드가 아닙니다.`,
  doNotFindId: id => `${id}은 존재하지 않는 id입니다.`,
  emptyStatus: status => `${status}는 비어있습니다.`,
  alreadyHaveItem: (status) => `해당 Id는 이미 ${status}상태입니다.`
}

function command(input) {
  let splited = input.split('$');
  if (!mainCommand[splited[0]]) console.log(errorMsg.notCommand(splited[0]));
  else mainCommand[splited[0]](splited[1], splited[2]);
}

function addTodo(todoName) {
  let id = mainCommand.getId();
  todoList.todo[id] = {
    name: todoName
  };
  showAddedTodo(id, todoName);
  showStatus();
}

function showAddedTodo(id, todoName) {
  console.log(`id : ${id} '${todoName}' 과목이 새로 추가됐습니다.`);
}

function showStatus() {
  let status = Object.keys(todoList).map(v => `${v} : ${Object.keys(todoList[v]).length}개`);
  console.log(`현재상태 : ${status.join(', ')}`);
}

function showSelectedStatus(status) {
  let list = [];
  for (key in todoList[status]) {
    list.push(`[${key}] ${todoList[status][key].name}`);
  }
  console.log(list.length !== 0 ? list.join(', ') : errorMsg.emptyStatus(status));
}

function updateTodo(id, status) {
  let finding = findItemById(id);
  if (!finding) {
    console.log(errorMsg.doNotFindId(id));
    return;
  }
  if (finding.key === status) {
    console.log(errorMsg.alreadyHaveItem(status));
    return;
  }

  todoList[status][id] = finding.value;
  delete todoList[finding.key][id];
  showStatus();
}

function findItemById(id) {
  for (key in todoList) {
    if (todoList[key][id]) return {
      key: key,
      value: todoList[key][id]
    };
  }
  return undefined;
}

command('add$자바스크립크 공부하기');
command('add$산책하기');
command('show$todo');
command('update$2$done');
command('add$코딩하기');
command('update$7$doing');
command('show$todo');
command('show$doing');
command('show$done');
command('update$2$done');