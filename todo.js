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

const TIME = new Date();

const TODO = [{
    id: 1,
    task: "자바스크립트 공부하기",
    states: "todo",
    time: 0
  },
  {
    id: 2,
    task: "그래픽스공부",
    states: "doing",
    time: 0
  },
  {
    id: 3,
    task: "블로그쓰기",
    states: "todo",
    time: 12
  },
  {
    id: 4,
    task: "운동하기",
    states: "done",
    time: 2
  }
];

const MSG = {
  request: "명령어를 입력하세요: ",
  add: " 항목이 새로 추가됐습니다.",
  again: "또 입력할까요? (네/아니요) "
};

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const init = (task) => {
  rl.question(MSG.request, (task) => {
    const command = task.split("$")[0];
    const message = task.split("$")[1];
    const status = task.split("$")[2];

    if (command === 'add') {
      checking.add(command, message);
    } else if (command === 'show') {
      checking.show(command, message);
    } else if (command === 'update') {
      checking.update(command, message, status);
    };

    againCmd(command);
  });
}


let checking = {
  add: (command, message) => {
    let id = TODO.length + 1;
    TODO.push({
      "id": id,
      "task": message,
      "states": "todo"
    });
    console.log(message + MSG.add);
  },

  show: (command, message) => {
    TODO.forEach(elem => {
      if (elem.states === message) {
        if (message === 'todo') {
          console.log(elem.id + ", " + elem.task + ",");
        } else if (message === 'doing') {
          console.log(elem.id + ", " + elem.task + ", " + elem.time + "시 시작");
        } else if (message === 'done') {
          console.log(elem.id + ", " + elem.task + ", " + elem.time + "시간");
        }
      }
    })
  },

  update: (command, message, status) => {
    if (!message) {
      let statesArray = [];
      let statesResult = {};
      TODO.forEach(elem => {
        statesArray.push(elem.states);
      });
      statesArray.sort().forEach(elem => {
        statesResult[elem] = statesResult[elem] === undefined ? 1 : statesResult[elem] += 1;
      })
      for (var value in statesResult) {
        console.log(value + ": " + statesResult[value] + "개");
      }
    } else if (!!message) {
      TODO.forEach(elem => {
        if (elem.id === Number(message)) {
          elem.states = status;
          elem.time = TIME.getHours() - elem.time;
        }
      });
    }
  }
};


const againCmd = (command) => {
  rl.question(MSG.again, (answer) => {
    let confirm = {
      '네': init,
      '아니요': rl.close
    }[answer];
    confirm(answer);
  })
}


init();