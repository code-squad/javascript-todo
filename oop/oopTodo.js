const data = require('./data');
const datalist = data.todos;
const readline = require('readline');
const inputReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


const TodoUI = function () { };

// addTodo
TodoUI.prototype.addTodoExecutor = function (todoElement, todoTag) {
    this.addTodoList(todoElement, todoTag);
}

TodoUI.prototype.addTodoList = function (todoElement, todoTag) {
    const id = this.createNewID(datalist, 10000)

    const newTodo = {
        'name': todoElement,
        'tag': todoTag,
        'status': "todo",
        'id': id
    };
    datalist.push(newTodo);

    return this.addTodoResult(newTodo);
}


TodoUI.prototype.addTodoResult = function (newAddedObject) {
    const addlistResult = `${newAddedObject.name} 1 개가 추가됐습니다.(id : ${newAddedObject.id})`;
    return this.showAll_printResult(addlistResult);
}

// deleteTodo
TodoUI.prototype.deleteTodoExecutor = function (deleteID) {
    return this.checkID(deleteID) ? this.deleteTodoList(deleteID) : this.printError()
};

TodoUI.prototype.deleteTodoList = function (deletedID) {
    const deletedIndex = this.getIndex(deletedID);
    datalist.splice(deletedIndex, 1);
    return this.deleteTodoResult(deletedIndex)
};

TodoUI.prototype.deleteTodoResult = function (deletedIndex) {
    const deletionResult = `${datalist[deletedIndex].name}가 ${datalist[deletedIndex].status}에서 삭제되었습니다.`
    return this.showAll_printResult(deletionResult);
};


// updateTodo
TodoUI.prototype.updateTodoExecutor = function (id, updatedStatus) {
    setTimeout(() => {
        return this.checkID(id) ? this.updateTodoStatus(id, updatedStatus) : this.printError()
    }, 3000)
};


TodoUI.prototype.updateTodoStatus = function (id, updatedStatus) {
    const updatatingIndex = this.getIndex(id);
    datalist[updatatingIndex].status = updatedStatus;
    return this.updateTodoResult(updatatingIndex, updatedStatus)
};


TodoUI.prototype.updateTodoResult = function (updatatingIndex, updatedStatus) {
    const updateResult = `${datalist[updatatingIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
    return setTimeout(() => {
        this.showAll_printResult(updateResult);
    }, 3000);
};

TodoUI.prototype.showElementGetter = function () {
    const todoList = this.checkStatus(datalist, 'todo');
    const doingList = this.checkStatus(datalist, 'doing');
    const doneList = this.checkStatus(datalist, 'done');
    return { todoList, doingList, doneList }
}


TodoUI.prototype.showTodoList = function (status) {
    const showElementList = this.showElementGetter()
    return this.showStatusExecutor(status, showElementList);
}

TodoUI.prototype.showStatusExecutor = function (status, showElementList) {
    const { todoList, doingList, doneList } = showElementList
    switch (status) {
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


TodoUI.prototype.showAll_printResult = function (result) {
    this.printResult(result);
    setTimeout(() => {
        this.printResult((this.showTodoList('all')));
        inputReadline.prompt();
    }, 1000);
}

TodoUI.prototype.splitInputVal = function (inputData) {
    const splitOnDollarSymbol = inputData.split("$");
    return splitOnDollarSymbol
}

TodoUI.prototype.printResult = function (result) {
    console.log(result);
}


TodoUI.prototype.printError = function () {
    return console.error('입력하신 값이 존재하지않습니다. \n');
}


TodoUI.prototype.getIndex = function (inputId) {
    return datalist.map((element) => { return element["id"] }).indexOf(inputId);
}


TodoUI.prototype.checkStatus = function (objData, status) {
    return objData.filter(list => list.status === status).map(list => { return list.name }); // list.name을 한 이유는? 그냥 list만 return 해도 될 듯
}


TodoUI.prototype.createNewID = function (datalist, maxNumOfID) {
    const newID = Math.floor(Math.random() * maxNumOfID) + 1;
    const checkDuplicatedID = this.checkID(newID);
    if (typeof checkDuplicatedID !== 'undefined') createNewID(datalist, maxNumOfID);

    return newID;
}


TodoUI.prototype.checkID = function (inputID) {
    const [matchedListByID] = datalist.filter(list => {
        return list.id == inputID
    })
    return matchedListByID;
}


TodoUI.prototype.checkCommands = function (userInput, inputReadline) {
    const splitUserInput = this.splitInputVal(userInput);
    if (userInput.split('$').length < 2 || userInput.split('$').length > 3) {
        console.log("입력값을 확인해주세요");
        inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
        inputReadline.prompt();
        return;
    }

    const [command, commandElement, TagORStatusOfcommandElement] = splitUserInput;

    if (command === 'show') {
        this.printResult(this.showTodoList(commandElement));
        inputReadline.prompt();
    } else if (command === 'add') {
        this.addTodoExecutor(commandElement, TagORStatusOfcommandElement);

    } else if (command === 'update') {
        this.updateTodoExecutor(Number(commandElement), TagORStatusOfcommandElement);

    } else if (command === 'delete') {
        this.deleteTodoExecutor(Number(commandElement));

    } else {
        this.printError();
    }

}

TodoUI.prototype.mainExecutor = function () {
    inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
    inputReadline.prompt();
    inputReadline.on('line', function (line) {

        if (line === "q") inputReadline.close();
        todoList.checkCommands(line, inputReadline);
    })

        .on('close', function () {
            console.log('프로그램이 종료되었습니다.');
            process.exit();
        });
}

const todoList = new TodoUI();
todoList.mainExecutor();