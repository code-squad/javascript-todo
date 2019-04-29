class UpdateManager {
    constructor(model, todoList, utility) {
        this.model = model;
        this.todoList = todoList;
        this.utility = utility;
        this.historyStack = [];
        this.historyStackPointer = 0;
    }

    execute (id, status) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const prevStatus = this.utility.getObjectById(id)['status'];
        const objToUpdate = this.model.updateTodoObject(id, status);
        this.historyStack.push([previousTodoList, objToUpdate, prevStatus]);
        this.historyStackPointer++;

        return objToUpdate;
    }

    undo() {
        const [previousTodoList, undoObj, prevStatus] = this.historyStack[--this.historyStackPointer];
        this.utility.save(previousTodoList);
        return [undoObj, prevStatus];
    }
}

module.exports = UpdateManager;