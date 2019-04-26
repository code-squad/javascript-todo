const todoError = require('./todo-error')
const errorCheck = new todoError();

function TodoList() {
    this.data = [];
 }

 TodoList.prototype.createId = function (inputString) {
    let hashNumber = 0;
    for( let i=0; i < inputString.length ; i++) {
        hashNumber += inputString.charCodeAt(i);
    };
    return hashNumber;
 };

TodoList.prototype.checkInput = function(input, inputReadline) {
    const [action, ...restInput] = input.split(',');
    const that = this;
    try {
        errorCheck.printError(input, that);
    if(action === 'show') {
        this.showItem(...restInput, inputReadline);
        return
    }
    const updatedList = this.sortItem(action, restInput, inputReadline);
    this.printUpdate(action, updatedList, inputReadline, 1000, 3000)
    } catch (e) {
        console.log(e.message);
        inputReadline.prompt();
    }
}

TodoList.prototype.sortItem = function (action, restInput, inputReadline) {
    const obj = {
        "add" : "addItem",
        "delete" : "deleteItem",
        "update" : "updateItem",
    }

    return this[obj[action]](...restInput);
}

TodoList.prototype.addItem = function (name, tag) {
    const id = this.createId(name)
    let newTodo = {
        name,
        tag,
        status : "todo",
        id
    }
    this.data.push(newTodo);
    return newTodo;
 }

TodoList.prototype.checkID = function (id) {
    const matchedListById = this.data.filter(list => {
        return list.id === id
    })
    return matchedListById
}

TodoList.prototype.deleteItem = function (id) {
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId);
    const matchedIndex = this.data.indexOf(matchedListById);
    this.data.splice(matchedIndex, 1);
    return matchedListById;
 }

TodoList.prototype.updateItem = function (id, inputStatus) {
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId);
    // 같은 상태로 업데이트 하려고 할때( ex. 이미 doing 상태인데 다시 doing으로 바꾸려고 할때)
    const matchedIndex = this.data.indexOf(matchedListById);
    this.data[matchedIndex].status = inputStatus
    return matchedListById;
 }

TodoList.prototype.showItem = function (status, inputReadline) {
    status === 'all' ? this.showAll(inputReadline) : this.showTodo(status, inputReadline)
}

TodoList.prototype.showAll = function (inputReadline) {
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
    })
    console.log(`현재상태 : todo: ${allList.todo.length}개, doing: ${allList.doing.length}, done: ${allList.done.length}`);
    inputReadline.prompt();
}

TodoList.prototype.showTodo = function (status, inputReadline) {
    const result = this.data.filter(v => v.status === status).map(v => v.name);
    console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
    inputReadline.prompt();
}

TodoList.prototype.printUpdate = function(action, updatedList, inputReadline, showAllMsgTimeout, updateMsgTimeout) {
    if (action === "update") {
        setTimeout(() => {
            console.log(`${updatedList.name} ${updatedList.status}으로 상태가 변경되었습니다.`)
            setTimeout(() => {
                this.showItem('all', inputReadline);
            }, showAllMsgTimeout);
        }, updateMsgTimeout);
        return
    }

    if (action === "add") {
        console.log(`${updatedList.name} 1개가 추가됐습니다. (id : ${updatedList.id})`);
    }
    
    if (action === "delete") {
        console.log(`${updatedList.name} ${updatedList.status}가 목록에서 삭제됐습니다.`);
    }

    setTimeout(() => {
        this.showItem('all', inputReadline);
    }, showAllMsgTimeout);
}

module.exports = TodoList;



// Test Case:
// add,sleep,['very urgent']
// update,537,done
// show,done
// show,all
// delete,537

