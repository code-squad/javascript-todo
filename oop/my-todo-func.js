let readline = require('readline');

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const todoList = [
    { name: 'asdf1', tag: [ 'asdf' ], status: 'todo', id: 9547 },
    { name: 'asdf2', tag: [ 'asdf' ], status: 'todo', id: 9546 },
    { name: 'asdf3', tag: [ 'asdf' ], status: 'todo', id: 9545 },
    { name: 'asdf4', tag: [ 'asdf' ], status: 'todo', id: 9544 }
];

const todoForm = function (name, tag, status, id) {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}

const findDataIdObj = (input) => {
    let target = todoList.filter(v => v["id"] === input);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);    
    return [targetIdx, targetName];
}



const showPrint = function() {}

showPrint.prototype.printShowAll = function(todo, doing, done){
    console.log(`현재 상태 : todo: ${todo}개, doing: ${doing}개, done: ${done}개`)
}
showPrint.prototype.printShowElse = function(temp_length, temp){
    console.log(`${this.value1}리스트 : 총 ${temp_length}건 : ${temp}`);
}
showPrint.prototype.printAdd = function(name,id){
    console.log(`${name} 1개가 추가됐습니다. (id : ${id})`);
}
showPrint.prototype.printUpdate = function(targetName, status){
    console.log(`${targetName} 가 ${status}상태로 변경되었습니다.`);
}
showPrint.prototype.printDelete = function(targetName){
    console.log(`${targetName} 가 todo에서 삭제되었습니다.`)
}

const errorCheck = function() {}

errorCheck.prototype.syntaxError = function(input) {
    let firstWord = input.match(/\w+/); 
    let seperator = input.match(/\$/g); 
    let zeroSeperator = (seperator===null);
    if(zeroSeperator === true){
        return false;
    }else{
        let oneSeperator = ((firstWord[0] === "delete" || firstWord[0] === "show") && (seperator.length===1));
        let twoSeperator = ((firstWord[0] === "add" || firstWord[0] === "update") && (seperator.length===2));
        return oneSeperator || twoSeperator ? true : false;
    }
    
}
errorCheck.prototype.unknownIDError = function(ID) {
    if(ID === NaN) {
        return false;
    } 
    return !(todoList.filter(v => v["id"] === ID).length === 0) ? true : false;
}
errorCheck.prototype.duplicatedStatusError = function(ID, status) {
    return !(todoList.filter(v => v["id"] === ID)[0]["status"] === status) ? true : false;
}

const Print = new showPrint();
const Error = new errorCheck();

const todoShow = (input) => {
    let status = input[0];
    status === 'all' ? todoShowAll() : todoShowElse(status);
}

const todoShowAll = () => {
    let todo = todoList.filter(v => v.status === 'todo').length;
    let doing = todoList.filter(v => v.status === 'doing').length;
    let done = todoList.filter(v => v.status === 'done').length;

    //const Print = new showPrint(todo, doing, done);
    Print.printShowAll(todo,doing,done);
}

const todoShowElse = (input) => {
    let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})
    Print.printShowElse(temp.length, temp);
}

const showAllTimer = (input) => {
    setTimeout(todoShowAll, input);
}


// add
const todoAdd = (input) => {
    let [name, tag] = input;
    let id = makingID();
    let newTodoList = new todoForm(name, tag, 'todo', id);
    todoList.push(newTodoList);
    
    Print.printAdd(name,id);
    showAllTimer(1000);
}

const makingID = () => {
    return Math.floor(Math.random() * 10000);
}


// delete
const todoDelete = (id) => {
    let [targetIdx, targetName] = findDataIdObj(id)
    todoList.splice(targetIdx,1);

    Print.printDelete(targetName);
    showAllTimer(1000);
}

// update
const todoUpdate = (id, status) => {
    let [targetIdx, targetName] = findDataIdObj(id)
    todoList[targetIdx].status = status;

    setTimeout(()=>{Print.printUpdate(targetName, status)}, 1000);
    showAllTimer(4000);
} 





const arr = "add"
todoMain = (answer) => {
    if(Error.syntaxError(answer) === false) {
        console.log("문법적으로 유효하지 않은 입력값입니다.");
        return 
    }
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoAdd(tempArr);
    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        Error.unknownIDError(ID)==false ? console.log("ID 사용이 잘못되었습니다.") : todoDelete(ID);
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        Error.unknownIDError(ID)==false || Error.duplicatedStatusError(ID,status)==false ? console.log("ID혹은 Status가 잘못되었습니다.") : todoUpdate(ID, status)

    } else if(action === "show") {
        todoShow(tempArr);

    } else {
        console.log("올바른 명령을 입력해주세요.");
    }

    console.log(todoList);

    const reOrder = () => {
        r.prompt()    
     }
    action === 'update' ? setTimeout(reOrder, 5000) : setTimeout(reOrder, 2000);
}

todoMain(arr)


 r.setPrompt('명령하세요 : ');
 r.prompt();
 r.on('line', (line) => {
    
     if(line === 'exit') {
         r.close();
     }

     todoMain(line);
 })

 r.on('close', () => {
     process.exit();
 })