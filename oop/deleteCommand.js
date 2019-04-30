const Command = require('./command');

class DeleteCommand extends Command {
    execute(id) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToDelete = this.model.deleteTodoObject(id);
        this.historyQueue.push([previousTodoList, objToDelete]);
        this.historyPointer++;
        return objToDelete;
    }
}

module.exports = DeleteCommand;