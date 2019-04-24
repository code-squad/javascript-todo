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