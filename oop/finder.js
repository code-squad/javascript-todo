const todoList = require('./todo.json')

module.exports = function Finder() {
    this.getObjectById = (id) => {
        return todoList.find((todoObj) => { return todoObj.id === parseInt(id) });
    }

    this.getIndexById = (id) => {
        return todoList.findIndex((todoObj) => { return todoObj.id === parseInt(id) });
    }
}