/* 
* 다음처럼 동작하는 프로그래밍을 만든다.

* 할일관리하는 프로그램이며, 다음의 기능이 있다.

* 할일을 추가할 수 있다.
* 할일이 추가되면 id 값을 생성하고 결과를 알려준다.
* 상태는 3가지로 관리된다.todo, doing, done.
* 각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
* 각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
* 명령어를 입력시 '$'를 구분자로 사용해서 넣는다.
* 이번 미션역시 대화형 프로그래밍을 위해서 nodejs에서 제공하는 방법을 구현한다.

* 참고 : https://nodejs.org/api/readline.html
 
*/

const STATES = {
  todo: 0,
  doing: 0,
  done: 0
}

const TODO = [{
    id: 5,
    task: "자바스크립트 공부하기",
    states: "todo"
  },
  {
    id: 1,
    task: "그래픽스공부",
    states: "doing"
  },
  {
    id: 4,
    task: "블로그쓰기",
    states: "doing"
  },
  {
    id: 3,
    task: "운동하기",
    states: "done"
  }
]


const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



rl.question('?: ', (task) => {
  var id = 6;
  const command = task.split("$")[0];
  const message = task.split("$")[1];

  addTodo(command, message, id);
  show(command, message);
});




const addTodo = (command, message, id) => {
  if (command === 'add') {
    TODO.push({
      "id": id++,
      "task": message,
      "states": "todo"
    });
    console.log(message + " 항목이 새로 추가됐습니다.");
  }
}



const show = (command, message) => {
  if (command === 'show') {
    if (message === 'todo') {
      for (let elem in TODO) {
        if (TODO[elem].states === 'todo') {
          console.log(TODO[elem].id + ", " + TODO[elem].task);
        }
      }
    } else if (message === 'doing') {
      for (let elem in TODO) {
        if (TODO[elem].states === 'doing') {
          console.log(TODO[elem].id + ", " + TODO[elem].task);
        }
      }
    } else if (message === 'done') {
      for (let elem in TODO) {
        if (TODO[elem].states === 'done') {
          console.log(TODO[elem].id + ", " + TODO[elem].task);
        }
      }
    }
    rl.close();
  }
}