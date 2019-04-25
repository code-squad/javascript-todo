



function todoList(input) {
    this.data = [];
 }

 todoList.prototype.createId = function (string) {
    let hash = 0;
    for( let i=0; i < string.length ; i++) {
        hash += string.charCodeAt(i);
    };
    return hash;
 };     

todoList.prototype.deliverParam = function (input) {
    input !== 'todo'? showAll() : showTodo()
}

todoList.prototype.checkInput = function(input) {
    const [action, ...restInput] = input.split(',');
    if(!findSeparator(action, input)) {
        throw '입력값을 확인해주세요.' 
    }    
    this.sortItem(action, restInput);
}

todoList.prototype.sortItem = function (action, restInput) {
    const obj = {
        "add" : "addItem",
        "delete" : "deleteItem",
        "update" : "updateItem",
        "show" : "showItem"
    }
    this[obj[action]](...restInput);
}

todoList.prototype.addItem = function (name, tag) {
    const id = this.createId(name)
    let newTodo = {
        name,
        tag,
        status : "todo",
        id
    }
    this.data.push(newTodo);
    this.showAll();
 }

todoList.prototype.checkID = function (id) {
    const matchedListById = this.data.filter(list => {
        return list.id === id
    })
   
   // console.log(matchedListById);
    return matchedListById
}

todoList.prototype.deleteItem = function (id) {
    const validId = parseInt(id);
    const matchedListById = this.checkID(validId);
    if(matchedListById === undefined) {
        throw 'ID값을 확인해주세요';
    }
    const matchedIndex = this.data.indexOf(matchedListById);
    this.data.splice(matchedIndex, 1);
 }

todoList.prototype.updateItem = function (id, inputStatus) {
    const validId = parseInt(id);
    const matchedListById = this.checkID(validId);
    this.data[matchedListById].status = inputStatus
    console.log(this.data);
 }

todoList.prototype.showItem = function (status) {
    console.log(status);
    if (status === 'all') { 
        this.showAll();
    } else { 
        this.showTodo(status);
    }
    // status === 'all' ? this.showAll() : this.showTodo(status)
}

todoList.prototype.showAll = function () {
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
}

todoList.prototype.showTodo = function (status) {
    const result = this.data.filter(v => v.status === status).map(v => v.name);
    console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
}


module.exports = todoList;



