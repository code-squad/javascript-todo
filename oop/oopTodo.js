const TodoUI = function() {};

TodoUI.prototype.addTodoExecutor = function(todoElement, todoTag) {
    addTodoList(todoElement, todoTag);
}

TodoUI.prototype.addTodoList = function(todoElement, todoTag) {
    let listFormat = {};
    listFormat.name = todoElement;
    list.tag = Array(`${todoTag}`);
    list.status = "todo";
    list.id = parseInt(Math.random() * 10000);
    datalist.push(format);

    return addTodoResult(listFormat);
}


TodoUI.prototype.addTodoResult = function (newAddedObject) {
    let addlistResult = `${newAddedObject["name"]} 1개가 추가됐습니다.(id : ${newAddedObject["id"]})`; 
    return setTimeoutShowAll(addlistResult);
} 

// deleteTodo

TodoUI.prototype.deleteTodoExecutor = function(deleteID) {
    return checkValidation(deleteID) ? deleteTodoResult(deleteID) : printError()
};


TodoUI.prototype.deleteTodoList = function(deletedIndex) {
    return datalist.splice(deletedIndex, 1);
};

TodoUI.prototype.deleteTodoResult = function(deletedID) {
    let deletedIndex = getIndex(deletedID);
    deleteTodoList(deletedIndex);
    let deletionResult =  `${datalist[deletedIndex]['name']}가 ${datalist[deletedIndex]['status']}에서 삭제되었습니다.`
    
    return showAll_printResult(deletionResult);
    };

    
// updateTodo

TodoUI.prototype.updateTodoExecutor = function(id, updatedstatus) {
    setTimeout(() => {
        return checkValidation(id) ? updateTodoResult(id, updatedstatus) : printError()
    }, 3000)
};


TodoUI.prototype.updateTodoStatus = function(updatingIndex, updatedstatus) {
    return datalist[updatingIndex].status = updatedstatus;
}; 


TodoUI.prototype.updateTodoResult = function(id, updatedStatus) {
    let getUpdatatingIndex = getIndex(id);
    updateTodoStatus(getUpdatatingIndex, updatedStatus);
    let updateResult = `${datalist[getUpdatatingIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
    return showAll_printResult(updateResult);
};


TodoUI.prototype.showTodoList = function(status) {
    let todoList = statusChecker(datalist, 'todo');
    let doingList = statusChecker(datalist, 'doing');
    let doneList = statusChecker(datalist, 'done');

    switch(status) {
        case 'all':
          return `현재상태 : todo: ${todoList.length}개, doing: ${doingList.length}개, done: ${doneList.length}개 \n`
        case 'todo':
          return `todo리스트 : 총 ${todoList.length} 건 : ${todoList} \n`
        case 'doing':
          return `doing리스트 : 총 ${doingList.length} 건 : ${doingList} \n`;
        case 'done':
          return `done리스트 : 총 ${doneList.length} 건 : ${doneList} \n`
        default:
          return '입력하신 값이 존재하지않습니다. \n';
    }
}


TodoUI.prototype.showAll_printResult = function(result) {
    printResult(result);
    setTimeout(() => {
        printResult((show('all')));
    }, 1000);
} 

TodoUI.prototype.splitInputVal = function(inputData) {
    let splitOnDollarSymbol = inputData.split("$");
    return splitOnDollarSymbol
}

TodoUI.prototype.printResult = function(result) {
    return console.log(result);
}


TodoUI.prototype.printError = function() {
    return console.error('입력하신 값이 존재하지않습니다. \n');
}


TodoUI.prototype.getIndex = function(inputId) {
    return datalist.map((element) => { return element["id"]}).indexOf(inputId);
}


TodoUI.prototype.statusChecker = function(objData, status) {
    return objData.filter(list => list.status === status).map(list => { return list.name}); // list.name을 한 이유는? 그냥 list만 return 해도 될 듯
}