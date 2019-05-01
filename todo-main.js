const todoError = require('./todo-error')


function TodoList() {
    this.data = [];
    this.history = [];
    this.pointer = 0;
    this.that = this;
    this.maxNumberOfPointer = 3;
    this.errorCheck = new todoError(this.that);
 }
 
TodoList.prototype.setHistory = function () {
    const renewalList = this.createNewList(this.data);
    this.history[this.pointer] = renewalList;
    if (this.pointer === 3) {
        this.history.shift()
    } else {
        this.pointer++
    }
}

TodoList.prototype.createNewList = function (todolist) {
    const renewalList = todolist.map((obj) => {
        const {name, tag, status, id} = obj;
        const newTodo = {
            name, tag, status, id
        }
        return newTodo;
    });
    
    return renewalList;
}

TodoList.prototype.createId = function (inputString) {
    let hashNumber = 0;
    for( let i=0; i < inputString.length ; i++) {
        hashNumber += inputString.charCodeAt(i);
    };
    return hashNumber;
};

TodoList.prototype.checkID = function (id) {
    const matchedListById = this.data.filter(list => {
        return list.id === id
    })
    return matchedListById
}

TodoList.prototype.checkInput = function(input) {
    const [action, ...restInput] = input.split(',');
    try {
        this.errorCheck.printError(input);
        if(action === 'show') {
            this.showItem(...restInput);
            return
        }
        if(action === 'undo' || action === 'redo') {
            this.callRedoUndo(action, );
            return
        }
        const updatedList = this.callAddDelUpdate(action, restInput);
        this.printUpdate({action, updatedList,showAllMsgTimeout: 1000, updateMsgTimeout: 3000});
    } catch (e) {
        console.log(e.message);
    } 
}

TodoList.prototype.addItem = function (name, tag) {
    this.setHistory();
    const id = this.createId(name)
    let newTodo = {
        name,
        tag,
        status : "todo",
        id
    }
    this.data.push(newTodo);
    console.log(this.data)
    return newTodo;
}

TodoList.prototype.deleteItem = function (id) {
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId);
    const matchedIndex = this.data.indexOf(matchedListById);
    this.data.splice(matchedIndex, 1);
    this.setHistory();
    return matchedListById;
}

TodoList.prototype.updateItem = function (id, inputStatus) {
    const validId = parseInt(id);
    const [matchedListById] = this.errorCheck.checkID(validId);
    // 같은 상태로 업데이트 하려고 할때( ex. 이미 doing 상태인데 다시 doing으로 바꾸려고 할때)
    const matchedIndex = this.data.indexOf(matchedListById);
    this.data[matchedIndex].status = inputStatus
    this.setHistory();
    return matchedListById;
 }

 TodoList.prototype.showItem = function (status) {
    status === 'all' ? this.showAll() : this.showTodo(status)
}

TodoList.prototype.showAll = function () {
    let allList = {
        'todo' : [],
        'doing' : [],
        'done' : []
    };
    this.data.forEach((list) => { 
        if (list['status'] === 'todo') {
            allList.todo.push(list['name']);
        } else if (list['status'] === 'doing') {
            allList.doing.push(list['name']);
        } else {
            allList.done.push(list['name']);
        }
    });
    console.log(`현재상태 : todo: ${allList.todo.length}개, doing: ${allList.doing.length}, done: ${allList.done.length}`);
}

TodoList.prototype.showTodo = function(status) {
    const result = this.data.filter(v => v.status === status).map(v => v.name);
    console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
}

TodoList.prototype.unDo = function () {
    const renewalList = this.createNewList(this.data);
    this.history[this.pointer] = renewalList;
    this.pointer--;
    const undoList = this.history[this.pointer]
    this.data = this.createNewList(undoList);
    }

TodoList.prototype.reDo = function () {
    this.pointer++;
    const redoList = this.history[this.pointer]
    this.data = this.createNewList(redoList);
    if (this.pointer === 3) {
        this.history.length = this.pointer;
    }
}

TodoList.prototype.callAddDelUpdate = function(action, restInput) {
    const obj = {
        "add" : "addItem",
        "delete" : "deleteItem",
        "update" : "updateItem",
    }
    return this[obj[action]](...restInput);
}

TodoList.prototype.callRedoUndo = function (action) {
    const obj = {
        "redo" : "reDo",
        "undo" : "unDo"
    }
    return this[obj[action]]();
}

TodoList.prototype.printUpdate = function({action, updatedList, showAllMsgTimeout, updateMsgTimeout}) {
    if(action === "update") {
        setTimeout(() => {
            console.log(`${updatedList.name} ${updatedList.status}으로 상태가 변경되었습니다.`)
            setTimeout(() => {
                this.showItem('all');
            }, showAllMsgTimeout);
        }, updateMsgTimeout);
        return
    }
    if(action === "add") {
        console.log(`${updatedList.name} 1개가 추가됐습니다. (id : ${updatedList.id})`);
    }
    
    if(action === "delete") {
        console.log(`${updatedList.name} ${updatedList.status}가 목록에서 삭제됐습니다.`);
    }
    
    setTimeout(() => {
        this.showItem('all');
    }, showAllMsgTimeout);
}

module.exports = TodoList;



// Test Case:
// add,sleep,['very urgent']
// update,537,done
// show,done
// show,all
// delete,537

