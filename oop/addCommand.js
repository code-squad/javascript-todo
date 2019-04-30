const Command = require('./command');

class AddCommand extends Command {
    execute (name, tag) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.historyStack.push([previousTodoList, objToAdd]);
        this.historyStackPointer++;
        this.model.addTodoObject(objToAdd);
        return objToAdd;
    }
}

module.exports = AddCommand;