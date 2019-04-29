const readline = require('readline');
const todoList = require('./data.js');
const errorCheck = require('./ErrorCheck.js');
const errorMsg = require('./errorMsg.js');
const todoPrint = require('./todoPrint.js');
//const util = require('./todo-util-method.js');
const todoCommonMethod = function() {}

const Print = new todoPrint.ShowPrint();
const Error = new errorCheck.ErrorCheck();

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});




const todoModel = Object.create(todoCommonMethod.prototype)

// show
todoModel.show = function (input) {
    let status = input[0];
    status === 'all' ? this.todoCount() : this.showElse(status);
}

// add
todoModel.add = function (input) {
    let [name, tag] = input;
    let id = this.makingID();
    let newTodoList = new this.todoForm(name, tag, 'todo', id);
    todoList.push(newTodoList);
    
    Print.printAdd(name,id);
    showAllTimer(1000);
}

// delete
todoModel.delete = function (id) {
    let [targetIdx, targetName] = this.findDataIdObj(id)
    todoList.splice(targetIdx,1);

    Print.printDelete(targetName);
    showAllTimer(1000);
}

// update
todoModel.update = function (id, status) {
    let [targetIdx, targetName] = this.findDataIdObj(id)
    todoList[targetIdx].status = status;

    setTimeout(()=>{Print.printUpdate(targetName, status)}, 1000);
    showAllTimer(4000);
} 


todoCommonMethod.prototype.todoCount = function () {
    let todo = todoList.filter(v => v.status === 'todo').length;
    let doing = todoList.filter(v => v.status === 'doing').length;
    let done = todoList.filter(v => v.status === 'done').length;

    Print.printShowAll(todo,doing,done);
}

todoCommonMethod.prototype.showElse = function(input) {
    let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})
    Print.printShowElse(temp.length, temp);
}

todoCommonMethod.prototype.todoForm = function (name, tag, status, id) {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}


todoCommonMethod.prototype.makingID = function(){
    return Math.floor(Math.random() * 10000);
}


todoCommonMethod.prototype.findDataIdObj = function(input){
    let target = todoList.filter(v => v["id"] === input);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);    
    return [targetIdx, targetName];
}



const showAllTimer = (input) => {
    setTimeout(todoCommonMethod.prototype.todoCount, input);
}



//var arr = "add$add$add"
// input & ErrorCheck
todoMain = (answer) => {
    if(Error.syntaxError(answer) === false) {
        Print.printError(errorMsg.syntaxError);
        return 
    }
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoModel.add(tempArr);
    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        Error.unknownIDError(ID)==false ? Print.printError(errorMsg.unknownIDError) : todoModel.delete(ID);
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        Error.unknownIDError(ID)==false || Error.duplicatedStatusError(ID,status)==false ? Print.printError(errorMsg.unknownID_duplicatedError) : todoModel.update(ID, status)

    } else if(action === "show") {
        todoModel.show(tempArr);

    } else {
        Print.printError(errorMsg.ELSE_ERROR);
    }

    console.log(todoList);

    const reOrder = () => {
        r.prompt()    
     }
    action === 'update' ? setTimeout(reOrder, 5000) : setTimeout(reOrder, 2000);
}

//todoMain(arr)


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