const Command = require('./command');

class AddCommand extends Command {
    execute (name, tag) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.historyQueue.push([previousTodoList, objToAdd]);
        this.historyPointer++;
        this.model.addTodoObject(objToAdd);
        return objToAdd;
    }
}

module.exports = AddCommand;