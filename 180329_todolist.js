function Thing(name){
  this.name = name;
  this.status = "todo";
  this.startTime = 0;
  this.endTime = 0;
  this.setStatus = function(status){
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
    // fns객체에서 flag 키에 맞는 함수를 호출합니다. fns[flag]가 가지는 함수를 곧바로 호출하면 함수 안의 함수 호출로 인해 실행 컨택스트가 바뀌게 됩니다.
    // 실행 컨텍스트를 올바르기 위해서 call메소드를 사용하여 command함수가 실행되고 있는 컨텍스트인 this를 바인드합니다.
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
    let result = Object.keys(this.Data.ThingsDict);
    result = result.filter(id => this.searchThing(id).status === status);
    result = result.reduce((acc, id) => [...acc, this.makeSentence(id)], []);
    console.log(result.join());
  },

  searchThing: function(id){
    return this.Data.ThingsDict[id];
  },

  makeSentence: function(id){
    const thing = this.searchThing(id);
    const subStr = thing.status === "done" ? `(소요시간: ${this.measureTime(thing)})` : '';
    return `"${id}, ${thing["name"]}${subStr}"`
  },

  measureTime: function(thing){
    let elapsedTime;
    elapsedTime = thing["endTime"] - thing["startTime"];
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