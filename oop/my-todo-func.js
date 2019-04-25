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

const showPrint = function(value1, value2, value3) {
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
}

showPrint.prototype.printShowAll = function(){
    console.log(`현재 상태 : todo: ${this.value1}개, doing: ${this.value2}개, done: ${this.value3}개`)
}
showPrint.prototype.printShowElse = function(){
    console.log(`${this.value1}리스트 : 총 ${this.value2}건 : ${this.value3}`);
}
showPrint.prototype.printAdd = function(){
    console.log(`${this.value1} 1개가 추가됐습니다. (id : ${this.value2})`);
}
showPrint.prototype.printUpdate = function(){
    console.log(`${this.value1} 가 ${this.value2}상태로 변경되었습니다.`);
}
showPrint.prototype.printDelete = function(){
    console.log(`${this.value1} 가 todo에서 삭제되었습니다.`)
}




const todoShow = (input) => {
    let status = input[0];
    status === 'all' ? todoShowAll() : todoShowElse(status);
}

const todoShowAll = () => {
    let todo = todoList.filter(v => v.status === 'todo').length;
    let doing = todoList.filter(v => v.status === 'doing').length;
    let done = todoList.filter(v => v.status === 'done').length;

    const Print = new showPrint(todo, doing, done);
    Print.printShowAll();
}

const todoShowElse = (input) => {
    let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})

    const Print = new showPrint(temp.length, temp);
    Print.printShowElse();
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
    
    const Print = new showPrint(name,id);
    Print.printAdd();
    showAllTimer(1000);
}

const makingID = () => {
    return Math.floor(Math.random() * 10000);
}


// delete
const todoDelete = (input) => {
    let id = Number(input[0]);
    let target = todoList.filter(v => v["id"] === id);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);
    todoList.splice(targetIdx,1);

    const Print = new showPrint(targetName);
    Print.printDelete();
    showAllTimer(1000);
}

// update
const todoUpdate = (input) => {
    let [id, status] = input;
    let target = todoList.filter(v => v["id"] === id); //e2
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);
    todoList[targetIdx].status = status;

    const Print = new showPrint(targetName, status);
    setTimeout(()=>{Print.printUpdate()}, 1000);
    showAllTimer(4000);
} 

function error1(input) {
    let firstWord = input.match(/\w+/); //["a"]
    let seperator = input.match(/\$/g); // ["$","$""]
    let zeroSeperator = (seperator===null);
    if(zeroSeperator === true){
        return false;
    }else{
        let oneSeperator = ((firstWord[0] === "delete" || firstWord[0] === "show") && (seperator.length===1));
        let twoSeperator = ((firstWord[0] === "add" || firstWord[0] === "update") && (seperator.length===2));
        return oneSeperator || twoSeperator ? true : false;
    }
    
}

function error2(ID) {
    if(ID === NaN) {
        return false;
    } 
    return !(todoList.filter(v => v["id"] === ID).length === 0) ? true : false;
}

function error3(ID, status) {
    return !(todoList.filter(v => v["id"] === ID)[0]["status"] === status) ? true : false;
}


const arr = "delete$9547"
todoMain = (answer) => {
    if(error1(answer) === false) {
        console.log("제대로된 입력을 해주세요.");
        return 
    }
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoAdd(tempArr);
    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        error2(ID)==false ? console.log("ID 사용이 잘못되었습니다.") : todoDelete(tempArr)
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        error2(ID)==false || error3(ID,status)==false ? console.log("ID혹은 Status가 잘못되었습니다.") : todoUpdate(tempArr)

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