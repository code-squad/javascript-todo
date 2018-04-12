const getModifiedObject = require('./immutable.js').object;

const message = {
  printAddedThing: function({id, name}){
    console.log(`id: ${id}, "${name}" 항목이 새로 추가되었습니다`);
  },

  printThings: function(group){
    // group은 id의 배열
    let result = group.reduce((string, id) =>{
      const thing = this.getThing(id);
      const elapsedTime = thing.status === 'done' ? `(소요시간: ${this.getElapsedTime(thing)})` : '';
      return string + `"${id}, ${thing.name}${elapsedTime}"`
    }, '');
    console.log(result);
  },

  printCurrentState: function({todo, doing, done}){
    console.log(`현재상태 :   todo: ${todo.length}개, doing: ${doing.length}개, done: ${done.length}개`);
  }
}

class Thing{
  constructor(name){
    this.name = name;
    this.status = "todo";
    this.timeStamp = [];
  }
}

class TodoList{
  constructor(){
    this.lastId = 0;
    this.thingsDict = {};
  }
  
  command(order){
    const fns = {
      add: this.addThing,
      show: this.showThing,
      update: this.updateThing
    }
    const [action, ...details] = order.split(/\$/);
    // ES6 문법인 destructuring과 rest parameter를 이용해 split된 값을 받습니다.    
    fns[action].call(this, ...details);
    // fns객체에서 action 키에 맞는 함수를 호출합니다. 함수 안의 함수가 호출되면서 실행컨텍스트가 바뀌고 thisBinding은 디폴트값인 global이 됩니다.
    // 호출되는 함수의 컨택스트가 참조하는 객체가 todoList객체이어야 하므로 this를 인자로 넘겨줘야 합니다.
  }

  addThing(name){
    const thing = new Thing(name);
    const id = this.getId();
    this.setThing(id, thing);
    message.printAddedThing({id:id, name: thing.name});
    message.printCurrentState(this.groupByStatus());
  }

  getId(){
    return ++this.lastId;
  }

  setThing(id, thing){
    const newThing = {};
    newThing[id] = thing;
    this.thingsDict = getModifiedObject({source: this.thingsDict, targetProp: id, initVal: newThing});
  }

  showThing(status){
    message.printThings.call(this, this.groupByStatus()[status]);
  }

  getThing(id){
    return this.thingsDict[id];
  }

  getElapsedTime(thing){
    return thing.timeStamp.reduce((acc, cur) => cur - acc);
  }

  updateThing(id, status){
    let thing = getModifiedObject({source: this.getThing(id)});
    this.setStatus(thing, status);
    this.setThing(id, thing);
    message.printCurrentState(this.groupByStatus());    
  }

  setStatus(target, status){
    if(status !== "todo") target.timeStamp.push((new Date()).getMilliseconds());
    target.status = status;
  }

  groupByStatus(){
    const group = {'todo': [], 'doing': [], 'done' : []};
    Object.keys(this.thingsDict).forEach(id =>{
      group[this.getThing(id).status].push(+id);
    });
    return group;
  }
}

const newTodoList = new TodoList();

newTodoList.command("add$자전거 타기");
newTodoList.command("update$1$doing");
newTodoList.command("show$doing");
newTodoList.command("add$독서하기");
newTodoList.command("update$2$doing");
newTodoList.command("update$2$done");
newTodoList.command("show$done");
newTodoList.command("update$1$done");
newTodoList.command("show$done");