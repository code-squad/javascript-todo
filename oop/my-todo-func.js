const readline = require('readline');
const errorMsg = require('./errorMsg.js');
const todoList = require('./data.js');
const todoProto = require('./todo-prototype.js');
const util = require('./todo-util-method.js');

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});


const Print = new todoProto.ShowPrint();
const Error = new todoProto.ErrorCheck();

const todoShow = (input) => {
    let status = input[0];
    status === 'all' ? todoShowAll() : todoShowElse(status);
}

const todoShowAll = () => {
    let todo = todoList.filter(v => v.status === 'todo').length;
    let doing = todoList.filter(v => v.status === 'doing').length;
    let done = todoList.filter(v => v.status === 'done').length;

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
    let newTodoList = new util.todoForm(name, tag, 'todo', id);
    todoList.push(newTodoList);
    
    Print.printAdd(name,id);
    showAllTimer(1000);
}

const makingID = () => {
    return Math.floor(Math.random() * 10000);
}


// delete
const todoDelete = (id) => {
    let [targetIdx, targetName] = util.findDataIdObj(id)
    todoList.splice(targetIdx,1);

    Print.printDelete(targetName);
    showAllTimer(1000);
}

// update
const todoUpdate = (id, status) => {
    let [targetIdx, targetName] = util.findDataIdObj(id)
    todoList[targetIdx].status = status;

    setTimeout(()=>{Print.printUpdate(targetName, status)}, 1000);
    showAllTimer(4000);
} 





const arr = "add$asdf$asdf"
todoMain = (answer) => {
    if(Error.syntaxError(answer) === false) {
        Print.printError(errorMsg.syntaxError);
        return 
    }
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoAdd(tempArr);
    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        Error.unknownIDError(ID)==false ? Print.printError(errorMsg.unknownIDError) : todoDelete(ID);
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        Error.unknownIDError(ID)==false || Error.duplicatedStatusError(ID,status)==false ? Print.printError(errorMsg.unknownID_duplicatedError) : todoUpdate(ID, status)

    } else if(action === "show") {
        todoShow(tempArr);

    } else {
        Print.printError(errorMsg.ELSE_ERROR);
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