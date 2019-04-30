const Command = require('./command');

class UpdateCommand extends Command {
    execute (id, status) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const prevStatus = this.utility.getObjectById(id)['status'];
        const objToUpdate = this.model.updateTodoObject(id, status);
        this.historyQueue.push([previousTodoList, objToUpdate, prevStatus]);
        this.historyPointer++;
        return objToUpdate;
    }

    undo() {
        const [previousTodoList, undoObj, prevStatus] = this.historyQueue[this.historyPointer--];
        this.historyQueue.pop();
        const currentTodoList = JSON.parse(JSON.stringify(this.todoList));
        this.undoQueue.push([currentTodoList, undoObj, prevStatus]);
        this.undoPointer++;    
        this.utility.save(previousTodoList);
        return [undoObj, prevStatus];
    }

    redo() {
        const [currentTodoList, redoObj, currentStatus] = this.undoQueue[this.undoPointer--];
        this.utility.save(currentTodoList);
        return [redoObj, currentStatus];
    }
}

module.exports = UpdateCommand;