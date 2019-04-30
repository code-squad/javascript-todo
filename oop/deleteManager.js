class DeleteMananger {
    constructor(model, todoList, utility) {
        this.model = model;
        this.todoList = todoList;
        this.utility = utility;
        this.historyStack = [];
        this.historyStackPointer = -1;
        this.undoStack = [];
        this.undoStackPointer = -1;
    }
    execute(id) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToDelete = this.model.deleteTodoObject(id);
        this.historyStack.push([previousTodoList, objToDelete]);
        this.historyStackPointer++;
        return objToDelete;
    }

    undo() {
        const [previousTodoList, undoObj] = this.historyStack[this.historyStackPointer--];
        this.historyStack.pop();
        const currentTodoList = JSON.parse(JSON.stringify(this.todoList));
        this.undoStack.push([currentTodoList, undoObj]);
        this.undoStackPointer++;

        this.utility.save(previousTodoList);

        return undoObj;
    }

    redo() {
        const [currentTodoList, redoObj] = this.undoStack[this.undoStackPointer--];
        this.utility.save(currentTodoList);
        return redoObj;
    }
}

module.exports = DeleteMananger;