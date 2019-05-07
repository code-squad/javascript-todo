const readline = require('readline');
const errorMsg = require('./errorMsg.js');
const todoPrint = require('./todoPrint.js');


const Print = new todoPrint.ShowPrint();


let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});


const showAllTimer = (input) => {
    setTimeout(()=>{todoCommonMethod.todoCount()}, input);
    setTimeout(()=>{r.prompt()} , input+1000) 
}

const ErrorCheck = class {
    syntaxError(input) {
        let firstWord = input.match(/\w+/); 
        let seperator = input.match(/\$/g); 
        let zeroSeperator = (firstWord[0] ==="undo" || firstWord[0] === "redo");
        let oneSeperator = ((firstWord[0] === "delete" || firstWord[0] === "show") && (seperator.length===1));
        let twoSeperator = ((firstWord[0] === "add" || firstWord[0] === "update") && (seperator.length===2));
        if(zeroSeperator || oneSeperator || twoSeperator){
            return true;
        }else if (seperator === null){
            return false;
        }else {
            return false;
        }
        
    }
    unknownIDError(ID) {
        if(ID === NaN) {
            return false;
        } 
        return !(todoModel.todoList.filter(v => v["id"] === ID).length === 0) ? true : false;
    }
    duplicatedStatusError(ID, status) {
        return !(todoModel.todoList.filter(v => v["id"] === ID)[0]["status"] === status) ? true : false;
    }
}
const Error = new ErrorCheck();

const TodoCommonMethod = class {
    todoCount() {
        let todo = todoModel.todoList.filter(v => v.status === 'todo').length;
        let doing = todoModel.todoList.filter(v => v.status === 'doing').length;
        let done = todoModel.todoList.filter(v => v.status === 'done').length;
    
        Print.printShowAll(todo,doing,done);
    }
    
    showElse(input) {
        let temp = todoModel.todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})
        Print.printShowElse(temp.length, temp);
    }
    
    makingID(){
        return Math.floor(Math.random() * 10000);
    }
    
    findDataIdObj(input){
        let target = todoModel.todoList.filter(v => v["id"] === input);
        let targetName = target[0].name;
        let targetIdx = todoModel.todoList.indexOf(target[0]);    
        return [targetIdx, targetName];
    }
}

const todoCommonMethod = new TodoCommonMethod();


const HistoryController = class {
    constructor() {
        this.undoHistory = [];
        this.redoHistory = [];
        this.HistoryForm = function (model, name, id, status, tag){
            this.model = model;
            this.name = name;
            this.id = id;
            this.status = status;
            this.tag = tag;
        }
    }

    historyLengthCheck(form){
        if(this.undoHistory.length < 3) {
            this.undoHistory.push(form);
        } else {
            this.undoHistory.shift();
            this.undoHistory.push(form);
        }
    }

    makeAddHistory(model, name, id, status, tag ){
        let historyForm = new this.HistoryForm(model, name, id, status, tag);
        this.historyLengthCheck(historyForm)
    }

    makeElseHistory(model, idx) {
        let todoListData = todoModel.todoList[idx]
        let [name, tag, status, id] = [todoListData['name'], todoListData['tag'], todoListData['status'], todoListData['id']];
        let historyForm = new this.HistoryForm(model, name, id, status, tag );
    
        this.historyLengthCheck(historyForm)
    }

    undoModel(model) {
        let target = this.undoHistory[this.undoHistory.length-1];
        let [name, tag, status, id] = [target['name'], target['tag'], target['status'], target['id']];
        
        switch(model){
        case 'add' :
            this.undoAdd(id);
            break;
    
        case 'update' :
            this.undoUpdate(id, status);
            break;
    
        case 'delete' :
            this.undoDelete(id, name, tag, status)
            break;
        }
    }   
    
    undoAdd(id) {
        todoModel.delete(id)
        this.undoHistory.pop();
    }
    undoUpdate(id, status) {
        todoModel.update(id, status)
        this.undoHistory.pop();
    }
    undoDelete(id, name, tag, status) {
        let newTodoList = new todoModel.TodoForm(name, tag[0], status, id);
        todoModel.todoList.push(newTodoList);
        Print.printAdd(name,id);
        showAllTimer(1000);
    }  
    
    dataInput(input) {
        this.redoHistory.push(input);
    }
    makeUpdateHistory(status) {
        if(this.undoHistory[0] === undefined){
            return;
        }
        this.undoHistory[this.undoHistory.length-1]['prev_status'] = status;
    }
    redoModel(model) {
        let target = this.redoHistory[this.redoHistory.length-1];
        let [name, tag, status, id, prev_status] = [target['name'], target['tag'], target['status'], target['id'], target['prev_status']];
    
        switch (model) {
            case 'add' :
                let newTodoList = new todoModel.TodoForm(name, tag[0], status, id);
                todoModel.todoList.push(newTodoList);
                Print.printAdd(name,id);
                showAllTimer(1000);
                this.undoHistory.pop();
                break;
            case 'update' :
                todoModel.update(id, prev_status);
                this.undoHistory.pop();
                break;
            case 'delete' :
                todoModel.delete(id, name, tag, status);
                this.undoHistory.pop();
                break;
        }
    }      
}
const historyController = new HistoryController();


const TodoModel = class{

    constructor() {
        this.todoList = [{ name: 'sfd', tag: [ 'sdf' ], status: 'todo', id: 2614 } ];
        this.TodoForm = function (name, tag, status, id) {
            this.name = name;
            this.tag = [tag];
            this.status = status;
            this.id = id;
        }
    }    
    show(input) {
        let status = input[0];
        status === 'all' ? todoCommonMethod.todoCount() : todoCommonMethod.showElse(status);
    }
    add(input) {
        let [name, tag] = input;
        let id = todoCommonMethod.makingID();
        let newTodoList = new this.TodoForm(name, tag, 'todo', id);
        historyController.makeAddHistory("add", name, id, 'todo', tag );

        this.todoList.push(newTodoList);
        
        Print.printAdd(name,id);
        showAllTimer(1000);
    }
    delete(id) {
        let [targetIdx, targetName] = todoCommonMethod.findDataIdObj(id)
        historyController.makeElseHistory('delete', targetIdx);
        this.todoList.splice(targetIdx,1);
    
        Print.printDelete(targetName);
        showAllTimer(1000);
    }
    update(id, status) {
        let [targetIdx, targetName] = todoCommonMethod.findDataIdObj(id)
        historyController.makeElseHistory('update', targetIdx);
        this.todoList[targetIdx].status = status;
        historyController.makeUpdateHistory(status);

        setTimeout(()=>{Print.printUpdate(targetName, status)}, 1000);
        showAllTimer(4000);
    } 
    
}


const todoModel = new TodoModel();

const arr = "update$2614$doing"

const todoMain = (answer) => {
    if(!Error.syntaxError(answer)) {
        Print.printError(errorMsg.syntaxError);
        return true;
    }
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoModel.add(tempArr);

    } else if(action === "delete") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        !Error.unknownIDError(ID) ? Print.printError(errorMsg.unknownIDError) : todoModel.delete(ID);
        
    } else if(action === "update") { 
        tempArr[0] = Number(tempArr[0])
        let ID = tempArr[0]
        let status = tempArr[1]
        !Error.unknownIDError(ID) || !Error.duplicatedStatusError(ID,status) ? Print.printError(errorMsg.unknownID_duplicatedError) : todoModel.update(ID, status)

    } else if(action === "show") {
        todoModel.show(tempArr);

    } else if(action === 'undo') {
        let data = historyController.undoHistory;
        let dataLength = data.length-1;
        historyController.undoModel(data[dataLength]['model']);
        historyController.redoHistory.push(data[dataLength]);
        data.pop();
        
    } else if(action === 'redo') {
        let data = historyController.redoHistory;
        let dataLength = data.length-1;
        historyController.redoModel(data[dataLength]['model']);
        data.pop();

    } else {
        Print.printError(errorMsg.ELSE_ERROR);
    }

    
    console.log(todoModel.todoList);
    console.log(historyController.undoHistory);
    console.log(historyController.redoHistory);

}



 r.setPrompt('명령하세요 : ');
 r.prompt();
 r.on('line', (answer) => {
    
    todoMain(answer);

 })

