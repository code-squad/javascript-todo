let thingsList = [];

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
  thing.id = thingsList.length + 1;
  thing.name = name;
  thing.status = "todo";
  thingsList.push(thing);
  console.log(`id: ${thing["id"]}, "${thing["name"]}"항목이 새로 추가되었습니다`);
  printStatus();
}

function showThing(status){
  let result = [];
  thingsList.forEach(function(thing){
    if(thing["status"] === status) result.push(`"${thing['id']}, ${thing["name"]}"`);
  });
  console.log(result.join());
}

function updateThing(id, status){
  thingsList[id-1]["status"] = status;
  printStatus();
}

function printStatus(){
  let todo = 0;
  let doing = 0;
  let done = 0;
  thingsList.forEach(thing => {
    if(thing["status"] === "todo") todo+=1;
    if(thing["status"] === "doing") doing+=1;
    if(thing["status"] === "done") done+=1;
  });
  console.log(`현재상태 :   todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
}

command("add$자전거 타기");
command("add$독서하기");
command("show$todo");
command("update$2$doing");
command("update$1$done");
command("show$done");