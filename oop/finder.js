const todoList = require('./todo.json')

function Finder() {}

Finder.prototype.getObjectById = function (id) {
    return todoList.find((todoObj) => { return todoObj.id === parseInt(id) });
}

Finder.prototype.getIndexById = function (id) {
    return todoList.findIndex((todoObj) => { return todoObj.id === parseInt(id) });
}

module.exports = Finder;

