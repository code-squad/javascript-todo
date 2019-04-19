const data = require('./todos');
const todos = data.todos;

const checkCommands = (input, inputReadline) => {
    if (input.split('$').length < 2 || input.split('$').length > 3) {
        console.log("입력값을 확인해주세요");
        inputReadline.prompt();
        return;
    }

    const [command, secondElment, thirdElement] = input.split('$');

    if (command === 'add') {
        const newTodo = addList(secondElment, thirdElement);
        if (newTodo !== undefined) printCommandResult(command, newTodo, inputReadline);
    }
    if (command === 'delete') {
        const matchedList = deleteList(secondElment, inputReadline);
        if (matchedList !== undefined) printCommandResult(command, matchedList, inputReadline);
    }
    if (command === 'update') {
        const matchedList = updateList(secondElment, thirdElement, inputReadline);
        if (matchedList !== undefined) printCommandResult(command, matchedList, inputReadline);
    }
    if (command === 'show') {
        show(todos, secondElment, inputReadline)
    }
}


const addList = (addName, addTag) => {
    const id = createNewID(todos);

    const newTodo = {
        'name': addName,
        'tag': addTag,
        'status': "todo",
        'id': id
    };
    todos.push(newTodo);
    return newTodo;
}


const deleteList = (deleteID, inputReadline) => {
    const idToNumber = parseInt(deleteID);
    const matchedListByID = checkID(idToNumber);

    if (matchedListByID === undefined) {
        errorOfDuplicatedID(inputReadline);
        return;
    }

    const matchedIndex = todos.indexOf(matchedListByID)
    todos.splice(matchedIndex, 1);
    return matchedListByID;
}


const updateList = (updateID, updateStatus, inputReadline) => {
    const idToNumber = parseInt(updateID);
    const matchedListByID = checkID(idToNumber);

    if (matchedListByID === undefined) {
        errorOfDuplicatedID(inputReadline);
        return;
    }

    const matchedIndex = todos.indexOf(matchedListByID);
    todos[matchedIndex].status = updateStatus;
    return matchedListByID;
}

const show = (todoList, status, inputReadline) => {
    if (status === `all`) {
        const [todoCount, doingCount, doneCount] = getAllStatus(todoList);
        printAllCurrentStatus(todoCount, doingCount, doneCount);
        inputReadline.prompt();
        return
    }

    const [todoCount_, todo_result] = getTodoName(todoList, status);
    printSpecificStatusList(status, todoCount_, todo_result);
    inputReadline.prompt();
    return
};

const createNewID = (todos) => {
    const newID = Math.floor(Math.random() * 10000) + 1;
    const checkDuplicatedID = checkID(newID)
    if (typeof checkDuplicatedID !== 'undefined') createNewID(todos);

    return newID;
}

const getAllStatus = todoList => {
    let todoCount = 0
    let doingCount = 0
    let doneCount = 0

    todoList.forEach(function (obj) {
        if (obj.status === "todo") {
            todoCount++;
        }
        if (obj.status === "doing") {
            doingCount++;
        }
        if (obj.status === "done") {
            doneCount++;
        }
    })
    return [todoCount, doingCount, doneCount]
};

const getTodoName = (todoList, status) => {
    totalCount = 0;
    const done_result = todoList.filter(function (obj) {
        return obj.status === status;
    })
        .map(function (obj) {
            totalCount++;
            return obj.name
        })

    return [totalCount, done_result];
}

const checkID = (inputID) => {
    const [matchedListByID] = todos.filter(list => {
        return list.id == inputID
    })
    return matchedListByID;
}

const errorOfDuplicatedID = (inputReadline) => {
    console.log("존재하지 않는 id 입니다.");
    inputReadline.prompt();

}

const printAllCurrentStatus = (todoCount, doingCount, doneCount) => {
    const result = `현재상태 : todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개`;
    console.log(result)
}

const printSpecificStatusList = (status, Count, list) => {
    const result = `${status}리스트 : 총 ${Count}개: ${list.join(', ')}`;
    console.log(result);
}

const printCommandResult = (command, updatedList, inputReadline) => {
    if (command === "update") {
        setTimeout(() => {
            console.log(`${updatedList.name} ${updatedList.status}으로 상태가 변경되었습니다.`)
            setTimeout(() => {
                show(todos, "all", inputReadline);
            }, 1000);
        }, 3000);
        return
    }

    if (command === "add") {
        console.log(`${updatedList.name} 1개가 추가됐습니다. (id : ${updatedList.id})`);
    }
    
    if (command === "delete") {
        console.log(`${updatedList.name} ${updatedList.status}가 목록에서 삭제됐습니다.`);
    }

    setTimeout(() => {
        show(todos, "all", inputReadline);
    }, 1000);
}



module.exports = {
    checkCommands
}


