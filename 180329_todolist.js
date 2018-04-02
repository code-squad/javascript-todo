const todoList = {
  thingsList : [],

  category : {
    "todo" : [],
    "doing": [],
    "done": []
  },

  id : 0,

  Thing: function(name){
    this.id = ++todoList.id;
    this.name = name;
    this.status = "todo";
    this.startTime = 0;
    this.endTime = 0;
    this.setStatus = function(status){
      if(status === "doing") this.startTime = (new Date()).getMilliseconds();
      if(status === "done") this.endTime = (new Date()).getMilliseconds();
      this.status = status;
    }
  },

  command: function(order){
    let subString = order.split(/\$/);
    switch(subString[0]){
      case "add":
        this.addThing(subString[1]);
        break;
      case "show":
        this.showThing(subString[1]);
        break;
      case "update":
        this.updateThing(subString[1], subString[2]);
        break;
      default : throw "올바른 값을 입력하세요";
    }
  },

  addThing: function(name){
    let thing = new this.Thing(name);
    this.pushId(thing["id"], "todo");  
    this.thingsList.push(thing);
    console.log(`id: ${thing["id"]}, "${thing["name"]}" 항목이 새로 추가되었습니다`);
    this.printStatus();
  },

  pushId: function(id, status){
    this.category[status].push(id);
  },

  showThing: function(status){
    let result = [];
    this.category[status].forEach(id=>{
      let thing = this.searchThing(id);
      let subStr = '';
      if(status === "done") subStr = `(소요시간: ${this.measureTime(thing)})`;
      result.push(`"${id}, ${thing["name"]}${subStr}"`);
    });
    console.log(result.join());
  },

  searchThing: function(id){
    for(let i = 0; i < this.thingsList.length; i++){
      if(this.thingsList[i]["id"] === id) return this.thingsList[i];
    }
    throw "값을 찾지 못했습니다";
  },

  measureTime: function(thing){
    let result;
    result = thing["endTime"] - thing["startTime"];
    return result;
  },

  updateThing: function(id, status){
    id = +id;
    let thing = this.searchThing(id);
    this.deleteId(id, thing["status"]);
    thing.setStatus(status);
    this.pushId(id, thing["status"]);
    this.printStatus();
  },

  deleteId: function(id, status){
    let index = this.category[status].indexOf(id);
    this.category[status].splice(index, 1);
  },

  printStatus: function(){
    let numTodo = this.category["todo"].length;
    let numDoing = this.category["doing"].length;
    let numDone = this.category["done"].length;
    console.log(`현재상태 :   todo: ${numTodo}개, doing: ${numDoing}개, done: ${numDone}개`);
  },
}

todoList.command("add$자전거 타기");
todoList.command("update$1$doing");
todoList.command("show$todo");
todoList.command("add$독서하기");
todoList.command("update$2$doing");
todoList.command("update$2$done");
todoList.command("show$done");
todoList.command("update$1$done");
todoList.command("show$done");