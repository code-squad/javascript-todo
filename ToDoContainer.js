const CommandParser = require("./CommandParser");

class ToDoContainer {
  constructor() {
    this.toDoList = {
      todo: [],
      doing: [],
      done: []
    } 
  }

  executeCommand(command) {
    const commandParser = new CommandParser(command);
    this.parsedCommand = commandParser.parseCommand('$');
    const [ methods ] = this.parsedCommand;

    switch(methods.toLowerCase()) {
      case 'add': {
        const task = this.parsedCommand[1];
        this.add(task);
        break;
      }
      case 'show': {
        const state = this.parsedCommand[1];
        this.show(state);
        break;
      }
      case 'update': {
        const id = this.parsedCommand[1];
        const moveTo = this.parsedCommand[2];
        this.update({id, moveTo});
        break;
      }
      default: {
        console.log('없는 기능입니다.');
        return;
      }
    }
  }

  add(task) {
    const id = Math.floor(Math.random() * 100000);
    const toDo = {
      id,
      task
    }
    this.toDoList.todo.push(toDo);
    return console.log(`add : ${id} : ${task} 일이 추가되었습니다.` )
  }

  show(state) {
    state = state.toLowerCase();

    if (!this.toDoList.hasOwnProperty(state)) 
      return console.log(`해당 ${state}(이)가 없습니다.`);

    this.toDoList[state].forEach(value => {
      if (!value) console.log(`해당 ${state}에 할 일이 없습니다.`)
      return console.log(value);
    });
  }

  update({id, moveTo}) {
    let task;
    Object.keys(this.toDoList).forEach(state => {
      this.toDoList[state].some((item, index) => {
        if (item.id === parseInt(id)) {
          task = item;
          delete this.toDoList[state][index];
        }
      })
      // delete 해서 undefined가 된 값을 제외하고 반환 
      this.toDoList[state] = this.toDoList[state].filter(x => x);
    })

    this.toDoList[moveTo].push(task);
  
    return console.log(`현재상태 : 
      todo:${this.toDoList['todo'].length}개,
      doing:${this.toDoList['doing'].length}개,
      done:${this.toDoList['done'].length}개`);
  }
}

/**
 * 실행 예제)
 */
let toDoContainer = new ToDoContainer();
toDoContainer.executeCommand('add$javascript');
toDoContainer.executeCommand('show$todo');
// toDoContainer.executeCommand('update$id$state');