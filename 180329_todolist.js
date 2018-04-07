class Thing{
  constructor(name){
    this.name = name;
    this.status = "todo";
    this.startTime = 0;
    this.endTime = 0;
  }
  setStatus(status){
    if(status === "doing") this.startTime = (new Date()).getMilliseconds();
    if(status === "done") this.endTime = (new Date()).getMilliseconds();
    this.status = status;
  }
}

const TodoList = {
  Data : {
    lastId : 0,
    ThingsDict : {}
  },

  command: function(order){
    const fns = {
      add: this.addThing,
      show: this.showThing,
      update: this.updateThing
    }
    const [flag, ...details] = order.split(/\$/);
    // ES6 문법인 distructuring과 rest parameter를 이용해 split된 값을 받습니다.    
    fns[flag].call(this, ...details);
    // fns객체에서 flag 키에 맞는 함수를 호출합니다. 함수 안의 함수가 호출되면서 실행컨텍스트가 바뀌고 thisBinding은 디폴트값인 global이 됩니다.
    // 호출되는 함수의 컨택스트가 참조하는 객체가 todoList객체이어야 하므로 this를 인자로 넘겨줘야 합니다.
  },

  addThing: function(name){
    const thing = new Thing(name);
    const id = this.getId();
    this.setId(id, thing);
    this.printAddedThing(id, thing);
    this.printStatus();
  },

  printAddedThing(id,thing){
    console.log(`id: ${id}, "${thing["name"]}" 항목이 새로 추가되었습니다`);
  },

  getId: function(){
    return ++this.Data.lastId;
  },

  setId: function(id, thing){
    this.Data.ThingsDict[id] = thing;
  },

  showThing: function(status){
    let sameStatusGroup = Object.keys(this.Data.ThingsDict);
    sameStatusGroup = sameStatusGroup.filter(id => this.searchThing(id).status === status);
    sameStatusGroup = sameStatusGroup.reduce((acc, id) => [...acc, this.makeSentence(id)], []);
    console.log(sameStatusGroup.join());
  },

  searchThing: function(id){
    return this.Data.ThingsDict[id];
  },

  makeSentence: function(id){
    const thing = this.searchThing(id);
    const subStr = thing.status === "done" ? `(소요시간: ${this.measureTime(thing)})` : '';
    return `"${id}, ${thing["name"]}${subStr}"`
  },

  measureTime: function({endTime, startTime}){
    let elapsedTime;
    elapsedTime = endTime - startTime;
    return elapsedTime;
  },

  updateThing: function(id, status){
    id = +id;
    let thing = this.searchThing(id);
    thing.setStatus(status);
    this.printStatus();
  },

  printStatus: function(){
    const NumStatus = {
      todo: 0,
      doing: 0,
      done: 0
    }
    for(let id in this.Data.ThingsDict){
      ++NumStatus[this.searchThing(id).status];
    }
    console.log(`현재상태 :   todo: ${NumStatus.todo}개, doing: ${NumStatus.doing}개, done: ${NumStatus.done}개`);
  }
}

TodoList.command("add$자전거 타기");
TodoList.command("update$1$doing");
TodoList.command("show$doing");
TodoList.command("add$독서하기");
TodoList.command("update$2$doing");
TodoList.command("update$2$done");
TodoList.command("show$done");
TodoList.command("update$1$done");
TodoList.command("show$done");