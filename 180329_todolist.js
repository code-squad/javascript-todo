let thingsList = [];

function command(action, str, id){
  switch(action){
    case "add":
      addThing(str);
      break;
    case "show":
      showThing(str);
      break;
    case "update":
      updateThing(id, str);
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

command("add", "퇴근하기");
command("show", 'todo');
command("add", "자전거 타기");
command("show", 'todo');
command("update",'doing', 2);
command("show", 'doing');
command("update",'done', 1);
command("show", 'done');