const getModifiedObject = require('./immutable.js').object;

class Thing{
  constructor(name){
    this.name = name;
    this.status = "todo";
    this.startTime = 0;
    this.endTime = 0;
  }
}

class TodoList{
  constructor(){
    this.Data = {
      lastId : 0,
      ThingsDict : {}
    };
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
    this.setId(id, thing);
    this.printAddedThing(id, thing);
    this.printStatus();
  }

  printAddedThing(id,thing){
    console.log(`id: ${id}, "${thing["name"]}" 항목이 새로 추가되었습니다`);
  }

  getId(){
    return ++this.Data.lastId;
  }

  setId(id, thing){
    const newThing = {};
    newThing[id] = thing;
    this.Data.ThingsDict = getModifiedObject({source: this.Data.ThingsDict, targetProp: id, initVal: newThing});
  }

  showThing(status){
    let sameStatusGroup = Object.keys(this.Data.ThingsDict)
    .filter(id => this.searchThing(id).status === status)
    .reduce((acc, id) => acc + this.makeSentence(id), '');
    console.log(sameStatusGroup);
  }

  searchThing(id){
    return this.Data.ThingsDict[id];
  }

  makeSentence(id){
    const thing = this.searchThing(id);
    const subStr = thing.status === "done" ? `(소요시간: ${this.measureTime(thing)})` : '';
    return `"${id}, ${thing["name"]}${subStr}"`
  }

  measureTime({endTime, startTime}){
    let elapsedTime;
    elapsedTime = endTime - startTime;
    return elapsedTime;
  }

  updateThing(id, status){
    let thing = getModifiedObject({source: this.searchThing(id)});
    this.setStatus(thing, status);
    this.setId(id, thing);
    this.printStatus();
  }

  setStatus(target, status){
    function recordTime(){return (new Date()).getMilliseconds();}
    if(status === "doing") target.startTime = recordTime();
    if(status === "done") target.endTime = recordTime();
    target.status = status;
  }

  printStatus(){
    const NumStatus = {todo: 0, doing: 0, done: 0}
    for(let id in this.Data.ThingsDict){
      ++NumStatus[this.searchThing(id).status];
    }
    console.log(`현재상태 :   todo: ${NumStatus.todo}개, doing: ${NumStatus.doing}개, done: ${NumStatus.done}개`);
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