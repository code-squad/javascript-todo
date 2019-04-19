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
    for (const object of todoList) {
        if (object['id'] === id) {
            return [object['name'], object['status']];
        }
    }
    console.log(`id ${id} 은(는) 존재하지 않습니다.`);
}

const getIdListByTodoList = () => {
    return todoList.map( (value) => { return value['id']; } );
}

// 1 ~ 9999 까지
const getRandomID = () => { 
    const limitLength = 10000;
    const IdList = getIdListByTodoList();
    while (IdList.length < limitLength) {
        const randomID = Math.floor(Math.random() * 10000) + 1;
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