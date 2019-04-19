const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
    terminal: false
});
const datalist = require('./data');

//----------------------------------------------------------------------------------------------------------

// Error Return Function
const errorMessage = () => {
  return console.log("입력하신 값이 존재하지않습니다. \n")
}


// Index Check Functions
const checker = (inputData) => {
  return datalist.some(function(el) {
      return typeof inputData === "string" ? el.name === inputData : el.id === inputData;
});
}

const getIndex = (inputDataId) => {
    return datalist.map(function(item) { return item.id; }).indexOf(inputDataId);
}


// Show Property Functions
const optimizedFunc = (obj, str) => {
  return obj.filter(el => el.status === str).map(el => {return el.name});
}


// show$all setTimeout Function
const setTimeoutShowAll = (printout) => {
  console.log(printout);
    setTimeout(() => {
        console.log((show('all')));
    }, 1000);
}

//----------------------------------------------------------------------------------------------------------
const show = (showStatus) => {
    let todoListName = optimizedFunc(datalist, 'todo');
    let doingListName = optimizedFunc(datalist, 'doing');
    let doneListName = optimizedFunc(datalist, 'done'); 

    switch(showStatus) {
      case 'all':
        return `현재상태 : todo: ${todoListName.length}개, doing: ${doingListName.length}개, done: ${doneListName.length}개 \n`
      case 'todo':
        return `todo리스트 : 총 ${todoListName.length} 건 : ${todoListName} \n`
      case 'doing':
        return `doing리스트 : 총 ${doingListName.length} 건 : ${doingListName} \n`;
      case 'done':
        return `done리스트 : 총 ${doneListName.length} 건 : ${doneListName} \n`
      default:
        return 'The status that you enter does not exist!'
 }
}

//----------------------------------------------------------------------------------------------------------
// Add Property Function
const addTodoList = (addName, addTag) => {
    let format = {};
    format["name"] = addName;
    format["tag"] = Array(`${addTag}`);
    format["status"] = "todo";
    format["id"] = parseInt(Math.random()*10000)
    datalist.push(format);
    let printOut = `${format["name"]} 1개가 추가됐습니다.(id : ${format["id"]})`; 
    return setTimeoutShowAll(printOut);
};
//----------------------------------------------------------------------------------------------------------

// Update Property Function
const updateTodoFunc = (updateId, updateStatus) => {
    let upIndex = getIndex(updateId);
    datalist[upIndex].status = updateStatus;
    let printOut = `${datalist[upIndex].name} 가 ${updateStatus}로 상태가 변경됬습니다.`;
    return setTimeoutShowAll(printOut);
}

// Update Execution
const updateTodoList = (updateId, updateStatus) => {
  setTimeout(() => {
    return checker(updateId) ? updateTodoFunc(updateId, updateStatus) : errorMessage();
  }, 3000)
};

//----------------------------------------------------------------------------------------------------------

// Delete Property Functions 
const deleteToListFunc = (deletedId) => {
    let rmIndex = getIndex(deletedId);
    let printOut = `${datalist[rmIndex]['name']}가 ${datalist[rmIndex]['status']}에서 삭제되었습니다.`
    datalist.splice(rmIndex, 1);
    return setTimeoutShowAll(printOut);
  }

// Delete Execution
  const deleteTodoList = (deletedId) => {
    return checker(deletedId) ? deleteToListFunc(deletedId) : errorMessage();
}


//----------------------------------------------------------------------------------------------------------


// Execution Function
const executeTodoList = () => {
 rl.question("명령하세요: ", function(answer) {
    let spliceStr = answer.match(/\w+/g);
    if(spliceStr[0] === 'show') {
       console.log(show(spliceStr[1]));
   } else if(spliceStr[0] === 'add') {
       addTodoList(spliceStr[1], (spliceStr[2])); 
   } else if(spliceStr[0] === 'update') {
       updateTodoList(Number(spliceStr[1]), spliceStr[2]);
   } else if(spliceStr[0] === 'delete') {
       deleteTodoList(Number(spliceStr[1]));
   } else {
       errorMessage();
   }

    spliceStr[0] === 'update' ? setTimeout(() => { executeTodoList()}, 5000) : setTimeout(() => {executeTodoList()}, 2000)
 })
};


executeTodoList();



