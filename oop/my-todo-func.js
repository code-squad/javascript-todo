const readline = require('readline');
const todoList = require('./data.js');
const errorCheck = require('./ErrorCheck.js');
const errorMsg = require('./errorMsg.js');
const todoPrint = require('./todoPrint.js');
const Error = new errorCheck.ErrorCheck();
const Print = new todoPrint.ShowPrint();

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const todoForm = function (name, tag, status, id) {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}

const showAllTimer = (input) => {
    setTimeout(todoCommonMethod.prototype.todoCount, input);
}

const todoCommonMethod = class {
    todoCount() {
        let todo = todoList.filter(v => v.status === 'todo').length;
        let doing = todoList.filter(v => v.status === 'doing').length;
        let done = todoList.filter(v => v.status === 'done').length;
    
        Print.printShowAll(todo,doing,done);
    }
    
    showElse(input) {
        let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})
        Print.printShowElse(temp.length, temp);
    }
    
    makingID(){
        return Math.floor(Math.random() * 10000);
    }
    
    findDataIdObj(input){
        let target = todoList.filter(v => v["id"] === input);
        let targetName = target[0].name;
        let targetIdx = todoList.indexOf(target[0]);    
        return [targetIdx, targetName];
    }
}


const undoHistory = [];

const HistoryForm = function (model, name, id, status, tag, prevCommend){
    this.model = model;
    this.name = name;
    this.id = id;
    this.status = status;
    this.tag = tag;
    this.prevCommend = prevCommend;
}

const makeAddHistory = function(model, name, id, status, tag, tempHistory){
    let historyForm = new HistoryForm(model, name, id, status, tag, tempHistory);

    if(undoHistory.length < 3) {
        undoHistory.push(historyForm);
    } else {
        undoHistory.shift();
        undoHistory.push(historyForm);
    }

}
const makeElseHistory = function(model, idx, tempHistory) {
    let todoListData = todoList[idx]
    let [name, tag, status, id] = [todoListData['name'], todoListData['tag'], todoListData['status'], todoListData['id']];
    let historyForm = new HistoryForm(model, name, id, status, tag, tempHistory);

    if(undoHistory.length < 3) {
        undoHistory.push(historyForm);
    } else {
        undoHistory.shift();
        undoHistory.push(historyForm);
    }
}

const undoModel = function(model) {
    let target = undoHistory[undoHistory.length-1];
    let [name, tag, status, id] = [target['name'], target['tag'], target['status'], target['id']];

    if(model === 'add') {
        undoAdd(id);

    } else if (model === 'update') {
        undoUpdate(id, status);

    } else if (model === 'delete') {
        undoDelete(id, name, tag, status)

    }
}   

const undoAdd = function(id) {
    todoModel.delete(id)
}
const undoUpdate = function(id, status) {
    todoModel.update(id, status)
}
const undoDelete = function(id, name, tag, status) {
    let newTodoList = new todoForm(name, tag[0], status, id);
    todoList.push(newTodoList);
}




const TodoModel = class extends todoCommonMethod{
//class todoModel extends todoCommonMethod{
    show(input) {
        let status = input[0];
        status === 'all' ? this.todoCount() : this.showElse(status);
    }
    add(input, tempHistory) {
        let [name, tag] = input;
        let id = this.makingID();
        let newTodoList = new todoForm(name, tag, 'todo', id);
        makeAddHistory("add", name, id, 'todo', tag, tempHistory);

        todoList.push(newTodoList);
        
        Print.printAdd(name,id);
        showAllTimer(1000);
    }
    delete(id, tempHistory) {
        let [targetIdx, targetName] = this.findDataIdObj(id)
        makeElseHistory('delete', targetIdx, tempHistory);
        todoList.splice(targetIdx,1);
    
        Print.printDelete(targetName);
        showAllTimer(1000);
    }
    update(id, status, tempHistory) {
        let [targetIdx, targetName] = this.findDataIdObj(id)
        makeElseHistory('update', targetIdx, tempHistory);
        todoList[targetIdx].status = status;
    
        setTimeout(()=>{Print.printUpdate(targetName, status)}, 1000);
        showAllTimer(4000);
    } 
    
}


const todoModel = new TodoModel();



//var arr = "update$9547$doing"
// input & ErrorCheck
todoMain = (answer) => {
    if(Error.syntaxError(answer) === false) {
        Print.printError(errorMsg.syntaxError);
        return true;
    }
    
    let tempHistory = answer;
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoModel.add(tempArr, tempHistory);

    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        Error.unknownIDError(ID)==false ? Print.printError(errorMsg.unknownIDError) : todoModel.delete(ID, tempHistory);
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        Error.unknownIDError(ID)==false || Error.duplicatedStatusError(ID,status)==false ? Print.printError(errorMsg.unknownID_duplicatedError) : todoModel.update(ID, status, tempHistory)

    } else if(action === "show") {
        todoModel.show(tempArr);

    } else if(action === 'undo') {
        undoModel(undoHistory[undoHistory.length-1]['model']);
        undoHistory.pop();
        
    } else if(action === 'redo') {

    } else {
        Print.printError(errorMsg.ELSE_ERROR);
    }

    console.log(todoList);
    console.log(undoHistory);

    const reOrder = () => {
        r.prompt()    
     }
    action === 'update' ? setTimeout(reOrder, 5000) : setTimeout(reOrder, 2000);
}

//todoMain(arr);


 r.setPrompt('명령하세요 : ');
 r.prompt();
 r.on('line', (line) => {
    
     if(line === 'exit') {
         r.close();
     }

     if(todoMain(line)) {
        r.prompt()
     }
 })

 r.on('close', () => {
     process.exit();
 })