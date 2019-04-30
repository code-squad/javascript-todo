const todoList = require('./todo.json')
const fs = require('fs')

const Utility = {
    splitInput(input) {
        return input.split('$');
    },

    getRandomID() {
        return Date.now();
    },

    save(todoList) {
        fs.writeFileSync('todo.json', JSON.stringify(todoList))
    },

    getObjectById(id) {
        return todoList.find((todoObj) => { return todoObj.id === parseInt(id) });
    },

    getIndexById(id) {
        return todoList.findIndex((todoObj) => { return todoObj.id === parseInt(id) });
    },
}

module.exports = Utility;