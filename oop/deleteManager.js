class DeleteMananger {
    constructor(model, todoList, utility) {
        this.model = model;
        this.todoList = todoList;
        this.utility = utility;
        this.historyStack = [];
        this.historyStackPointer = 0;
    }
    execute(id) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToDelete = this.model.deleteTodoObject(id);
        this.historyStack.push([previousTodoList, objToDelete]);
        this.historyStackPointer++;
        return objToDelete;
    }

    undo() {
        const [previousTodoList, undoObj] = this.historyStack[--this.historyStackPointer];
        this.utility.save(previousTodoList);
        return undoObj;
    }
}

module.exports = DeleteMananger;