let thingsList = [];
let category = {
  "todo" : [],
  "doing": [],
  "done": []
}
let lastId = 0;

function command(order){
  let subString = order.split(/\$/);
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
    default : throw "올바른 값을 입력하세요";
  }
}

function addThing(name){
  let thing = createThing(name);
  thingsList.push(thing);
  console.log(`id: ${thing["id"]}, "${thing["name"]}" 항목이 새로 추가되었습니다`);
  printStatus();
}

function createThing(name){
  let thing = {};
  thing.id = createId();
  thing.name = name;
  thing.status = "todo";
  thing.startTime = 0;
  thing.endTime = 0;
  pushId(thing["id"], "todo");
  return thing;
}

function createId(){
  return ++lastId;
}

function pushId(id, status){
  category[status].push(id);
}

function showThing(status){
  let result = [];
  category[status].forEach(id=>{
    let thing = searchThing(id);
    let subStr = '';
    if(status === "done") subStr = `(소요시간: ${measureTime(thing)})`;
    result.push(`"${id}, ${thing["name"]}${subStr}"`);
  });
  console.log(result.join());
}

function searchThing(id){
  for(let i = 0; i < thingsList.length; i++){
    if(thingsList[i]["id"] === id) return thingsList[i];
  }
  throw "값을 찾지 못했습니다";
}

function measureTime(thing){
  let result;
  result = thing["endTime"] - thing["startTime"];
  return result;
}

function updateThing(id, status){
  id = +id;
  let thing = searchThing(id);
  deleteId(id, thing["status"]);
  thing["status"] = status;
  pushId(id, thing["status"]);
  if(thing["status"] === "doing") thing["startTime"] = setTime();
  if(thing["status"] === "done") thing["endTime"] = setTime();
  printStatus();
}

function setTime(){
  let time = new Date();
  return time.getMilliseconds();
}

function deleteId(id, status){
  let index = category[status].indexOf(id);
  category[status].splice(index, 1);
}

function printStatus(){
  let numTodo = category["todo"].length;
  let numDoing = category["doing"].length;
  let numDone = category["done"].length;
  console.log(`현재상태 :   todo: ${numTodo}개, doing: ${numDoing}개, done: ${numDone}개`);
}

command("add$자전거 타기");
command("update$1$doing");
command("show$todo");
command("add$독서하기");
command("update$2$doing");
command("update$2$done");
command("show$todo");
command("update$1$done");
command("show$done");