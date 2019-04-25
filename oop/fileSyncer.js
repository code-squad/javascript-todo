const fs = require('fs')

module.exports = function FileSyncer() {
    this.save = (todoList) => fs.writeFileSync('todo.json', JSON.stringify(todoList));
}