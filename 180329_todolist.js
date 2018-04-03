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
    fns[flag].call(this, ...details);
  },

  addThing: function(name){
    const thing = new Thing(name);
    const id = this.createId();
    this.Data.ThingsDict[id] = thing;
    console.log(`id: ${id}, "${thing["name"]}" 항목이 새로 추가되었습니다`);
    this.printStatus();
  },

  createId: function(){
    return ++this.Data.lastId;
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
    let result;
    result = thing["endTime"] - thing["startTime"];
    return result;
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
  },
}

TodoList.command("add$자전거 타기");
TodoList.command("update$1$doing");
TodoList.command("show$todo");
TodoList.command("add$독서하기");
TodoList.command("update$2$doing");
TodoList.command("update$2$done");
TodoList.command("show$done");
TodoList.command("update$1$done");
TodoList.command("show$done");