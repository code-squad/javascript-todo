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

const HistoryForm = function (model, name, id, status, tag, prevCommend){
        this.model = model;
        this.name = name;
        this.id = id;
        this.status = status;
        this.tag = tag;
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
const redoHistory = [];

const Redo = class {
    dataInput(input) {
        redoHistory.push(input);
    }
    makeUpdateHistory(status) {
        undoHistory[undoHistory.length-1]['prev_status'] = status;
    }
    redoModel(model) {
        let target = redoHistory[redoHistory.length-1];
        let [name, tag, status, id, prev_status] = [target['name'], target['tag'], target['status'], target['id'], target['prev_status']];
    
        if(model === 'add') {
            todoModel.add(id);
            undoHistory.pop();
    
        } else if (model === 'update') {
            todoModel.update(id, prev_status);
            undoHistory.pop();
    
        } else if (model === 'delete') {
            todoModel.delete(id, name, tag, status);
            undoHistory.pop();
    
        }
    }       
}
const redo = new Redo();

const Undo = class {
    makeAddHistory(model, name, id, status, tag ){
        let historyForm = new HistoryForm(model, name, id, status, tag);
    
        if(undoHistory.length < 3) {
            undoHistory.push(historyForm);
        } else {
            undoHistory.shift();
            undoHistory.push(historyForm);
        }
    
    }
    makeDeleteHistory(model, idx) {
        let todoListData = todoList[idx]
        let [name, tag, status, id] = [todoListData['name'], todoListData['tag'], todoListData['status'], todoListData['id']];
        let historyForm = new HistoryForm(model, name, id, status, tag );
    
        if(undoHistory.length < 3) {
            undoHistory.push(historyForm);
        } else {
            undoHistory.shift();
            undoHistory.push(historyForm);
        }
    }
    
    makeUpdateHistory(model, idx) {
        let todoListData = todoList[idx]
        let [name, tag, status, id] = [todoListData['name'], todoListData['tag'], todoListData['status'], todoListData['id']];
        let historyForm = new HistoryForm(model, name, id, status, tag );
        
        if(undoHistory.length < 3) {
            undoHistory.push(historyForm);
        } else {
            undoHistory.shift();
            undoHistory.push(historyForm);
        }
    }

    undoModel(model) {
        let target = undoHistory[undoHistory.length-1];
        let [name, tag, status, id] = [target['name'], target['tag'], target['status'], target['id']];
    
        if(model === 'add') {
            this.undoAdd(id);
    
        } else if (model === 'update') {
            this.undoUpdate(id, status);
    
        } else if (model === 'delete') {
            this.undoDelete(id, name, tag, status)
    
        }
    }   
    
    undoAdd(id) {
        todoModel.delete(id)
        undoHistory.pop();
    }
    undoUpdate(id, status) {
        todoModel.update(id, status)
        undoHistory.pop();
    }
    undoDelete(id, name, tag, status) {
        let newTodoList = new todoForm(name, tag[0], status, id);
        todoList.push(newTodoList)
        //undoHistory.pop();    
    }
}

const undo = new Undo()






const TodoModel = class extends todoCommonMethod{
//class todoModel extends todoCommonMethod{
    show(input) {
        let status = input[0];
        status === 'all' ? this.todoCount() : this.showElse(status);
    }
    add(input) {
        let [name, tag] = input;
        let id = this.makingID();
        let newTodoList = new todoForm(name, tag, 'todo', id);
        undo.makeAddHistory("add", name, id, 'todo', tag );

        todoList.push(newTodoList);
        
        Print.printAdd(name,id);
        showAllTimer(1000);
    }
    delete(id) {
        let [targetIdx, targetName] = this.findDataIdObj(id)
        undo.makeDeleteHistory('delete', targetIdx);
        todoList.splice(targetIdx,1);
    
        Print.printDelete(targetName);
        showAllTimer(1000);
    }
    update(id, status) {
        let [targetIdx, targetName] = this.findDataIdObj(id)
        undo.makeUpdateHistory('update', targetIdx);
        todoList[targetIdx].status = status;
        redo.makeUpdateHistory(status);


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
    
    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);   

    if(action === "add") {
        todoModel.add(tempArr, );

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

    } else if(action === 'undo') {
        undo.undoModel(undoHistory[undoHistory.length-1]['model']);
        redoHistory.push(undoHistory[undoHistory.length-1]);
        undoHistory.pop();
        
    } else if(action === 'redo') {
        redo.redoModel(redoHistory[redoHistory.length-1]['model']);
        redoHistory.pop();

    } else {
        Print.printError(errorMsg.ELSE_ERROR);
    }

    console.log(todoList);
    console.log(undoHistory);
    console.log(redoHistory);

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