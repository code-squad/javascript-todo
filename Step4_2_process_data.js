const fs = require('fs');
const todoList = JSON.parse(fs.readFileSync('todo.json'));

const saveTodoList = (input, command) => {
    if (command === 'add') {
        const objectData = input;
        todoList.push(objectData);
    } else if (command === 'delete') {
        const index = input;
        todoList.splice(index, 1);
    } else if (command === 'update') {
        const index = input[0];
        const status = input[1];
        todoList[index]['status'] = status;
    }
    // write..
    fs.writeFileSync('todo.json', JSON.stringify(todoList));
}

const getStatusListByTodoList = () => {
    const statusList = {'todo': [], 'doing': [], 'done': []};
    todoList.forEach( (object) => {
        const inputData = `'${object['name']},${object['id']}'`;
        statusList[object['status']].push(inputData);
    } );
    return statusList;
}

const getNameAndStatusById = (id) => {
    return todoList.reduce( (arr, object, index) => {
        if (object['id'] === id) arr.push([index, object['name'], object['status']]);
        return arr;
    }, [] )[0];
}

const getIdListByTodoList = () => {
    return todoList.map( (object) => { return object['id']; } );
}

const getTodoId = (id) => {
    return getIdListByTodoList().filter( (element) => { return id === element; } )[0];
}

// 1 ~ 9999 까지
const getRandomID = () => { 
    const limitLength = 9999;
    const IdList = getIdListByTodoList();
    if (IdList.length >= limitLength) return limitLength+1;
    while (true) {
        const randomID = Math.floor(Math.random() * limitLength) + 1;
        let isExistsRandomID = false;
        for (const value of IdList) {
            if (value === randomID) {
                isExistsRandomID = true;
                break;
            }
        }
        if (!isExistsRandomID) return randomID;
    }
}

module.exports = { 
    saveTodoList, 
    getStatusListByTodoList, 
    getNameAndStatusById, 
    getIdListByTodoList, 
    getRandomID,
};