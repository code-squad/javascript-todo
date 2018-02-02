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

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const cmd = {
  todoList: [],

  messages: {
    request: "명령어를 입력하세요: ",
    add: " 항목이 새로 추가됐습니다.",
    again: "또 입력할까요? (네/아니요) "
  },

  init: function (task) {
    rl.question(this.messages.request, (task) => {
      [command, execute, status] = task.split("$");

      if (command === 'add') {
        this.add(command, execute);
      } else if (command === 'show') {
        this.show(command, execute);
      } else if (command === 'update') {
        this.update(command, execute, status);
      }
      this.again(command);
    })
  },

  
  add: function (...theArgs) {
    let id = this.todoList.length + 1;
    this.todoList.push({
      "id": id,
      "task": execute,
      "states": "todo",
      "time": 0
    });
    console.log(execute + this.messages.add);
  },


  show: function (...theArgs) {
    this.todoList.map(elem => {
      if (elem.states === 'done') {
        console.log(elem.id + ", " + elem.task);
      } else if (elem.states === execute) {
        console.log(elem.id + ", " + elem.task + ", " + elem.time + "시간");
      }
    })
  },


  update: function (...theArgs) {
    if (!execute) {
      const statesResult = {};
      this.todoList.map(elem => {
        return statesResult[elem.states] = statesResult[elem.states] === undefined ? 1 : statesResult[elem.states] += 1;
      });
      for (let elem in statesResult) {
        console.log(elem + ": " + statesResult[elem] + "개");
      }
    } else if (execute) {
      const time = new Date();
      this.todoList.forEach(elem => {
        if (elem.id === Number(execute)) {
          elem.states = status;
          if (status === 'doing') {
            elem.time = (Date.now() / 3600000).toFixed(0);
          } else if (status === 'done') {
            elem.time = ((Date.now() / 3600000) - elem.time).toFixed(0);
          }
        };
      });
    }
  },


  again: function (command) {
    rl.question(this.messages.again, (answer) => {
      if (answer === '네') {
        this.init();
      } else if (answer === '아니요') {
        rl.close();
      }
    });
  }
}

cmd.init();