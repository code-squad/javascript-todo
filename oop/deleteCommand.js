const Command = require('./command');

class DeleteCommand extends Command {
    execute(id) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToDelete = this.model.deleteTodoObject(id);
        this.historyStack.push([previousTodoList, objToDelete]);
        this.historyStackPointer++;
        return objToDelete;
    }
}

module.exports = DeleteCommand;