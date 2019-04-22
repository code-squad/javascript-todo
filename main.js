const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
    terminal: false
});

const datalist = require('./data');

const printResult = (value) => {
    return console.log(value);
}

// Error Return Function
const printError = () => {
    return console.error('입력하신 값이 존재하지않습니다. \n');
}


// Index Check Functions
const checker = (inputData) => {
  return datalist.some((el) => {
      return typeof inputData === "string" ? el.name === inputData : el.id === inputData;
});
}

const getIndex = (inputDataId) => {
    return datalist.map((item) => { return item.id; }).indexOf(inputDataId);
}


// Show Property Functions
const optimizedFunc = (obj, str) => {
  return obj.filter(el => el.status === str).map(el => {return el.name});
}


// show$all setTimeout Function
const setTimeoutShowAll = (printout) => {
  printResult(printout);
    setTimeout(() => {
      printResult((show('all')));
    }, 1000);
}

const show = (showStatus) => {
    let todoList = optimizedFunc(datalist, 'todo');
    let doingList = optimizedFunc(datalist, 'doing');
    let doneList = optimizedFunc(datalist, 'done'); 

    switch(showStatus) {
      case 'all':
        return `현재상태 : todo: ${todoList.length}개, doing: ${doingList.length}개, done: ${doneList.length}개 \n`
      case 'todo':
        return `todo리스트 : 총 ${todoList.length} 건 : ${todoList} \n`
      case 'doing':
        return `doing리스트 : 총 ${doingList.length} 건 : ${doingList} \n`;
      case 'done':
        return `done리스트 : 총 ${doneList.length} 건 : ${doneList} \n`
      default:
        return '입력하신 값이 존재하지않습니다. \n';
 }
}

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
    return checker(updateId) ? updateTodoFunc(updateId, updateStatus) : printError();
  }, 3000)
};



// Delete Property Functions 
const deleteToListFunc = (deletedId) => {
    let rmIndex = getIndex(deletedId);
    let printOut = `${datalist[rmIndex]['name']}가 ${datalist[rmIndex]['status']}에서 삭제되었습니다.`
    datalist.splice(rmIndex, 1);
    return setTimeoutShowAll(printOut);
  }

// Delete Execution
  const deleteTodoList = (deletedId) => {
    return checker(deletedId) ? deleteToListFunc(deletedId) : printError();
}


// Execution Function
const executeTodoList = () => {
 rl.question("명령하세요: ", function(answer) {
    let spliceStr = answer.match(/\w+/g);
    let todoInstruction = spliceStr[0];    
    if(todoInstruction === 'show') {
      printResult(show(spliceStr[1]));    // spliceStr[1]: all or todo or doing or done 
   } else if(todoInstruction === 'add') {
       addTodoList(spliceStr[1], (spliceStr[2])); // spliceStr[1] Name, spliceStr[2] Tag
   } else if(todoInstruction === 'update') {
       updateTodoList(Number(spliceStr[1]), spliceStr[2]); // spliceStr[1] ID, spliceStr[2] status
   } else if(todoInstruction === 'delete') {
       deleteTodoList(Number(spliceStr[1])); // spliceStr[1] ID
   } else {
       printError();
   }

    spliceStr[0] === 'update' ? setTimeout(() => { executeTodoList()}, 5000) : setTimeout(() => {executeTodoList()}, 2000)
 })
};


executeTodoList();



