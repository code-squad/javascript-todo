let thingsList = [];
let statuses = {
  "todo" : [],
  "doing": [],
  "done": []
}

function command(str){
  let subString = str.split(/\$/);
  switch(subString[0]){
    case "add":
      addThing(subString[1]);
      break;
    case "show":
      showThing(subString[1]);
      break;
    case "update":
      updateThing(subString[1], subString[2]);
      break;
    default : console.log("올바른 값을 입력하세요");
  }
}

function addThing(name){
  let thing = {};
  thing["id"] = thingsList.length + 1;
  thing["name"] = name;
  thingsList.push(thing);
  statuses["todo"].push(thing["id"]);
  console.log(`id: ${thing["id"]}, "${thing["name"]}"항목이 새로 추가되었습니다`);
  printStatus();
}

function showThing(status){
  let result = [];
  statuses[status].forEach(id =>{
    result.push(`"${id}, ${thingsList[id-1]["name"]}"`);
  });
  console.log(result.join());
}

function updateThing(id, status){
  id = +id;
  Object.keys(statuses).forEach(e => {
    for(let i = 0; i < statuses[e].length; i++){
      if(statuses[e][i] === id) statuses[e].splice(i, 1);
    }
  });
  statuses[status].push(id);
  printStatus();
}

function printStatus(){
  let numTodo = statuses["todo"].length;
  let numDoing = statuses["doing"].length;
  let numDone = statuses["done"].length;
  console.log(`현재상태 :   todo: ${numTodo}개, doing: ${numDoing}개, done: ${numDone}개`);
}

command("add$자전거 타기");
command("add$독서하기");
command("show$todo");
command("update$2$doing");
command("update$1$done");
command("show$done");