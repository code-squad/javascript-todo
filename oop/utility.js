const todoList = require('./todo.json')
const fs = require('fs')

function Utility() {}

Utility.prototype.splitInput = function (input) { return input.split('$'); } 

Utility.prototype.getRandomID = function () { return Date.now(); }    

Utility.prototype.save = function (todoList) { fs.writeFileSync('todo.json', JSON.stringify(todoList)) };

Utility.prototype.getObjectById = function (id) {
    return todoList.find((todoObj) => { return todoObj.id === parseInt(id) });
}

Utility.prototype.getIndexById = function (id) {
    return todoList.findIndex((todoObj) => { return todoObj.id === parseInt(id) });
}

module.exports = Utility;