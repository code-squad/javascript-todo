class Command {
    constructor(model, todoList, utility) {
        this.model = model;
        this.todoList = todoList;
        this.utility = utility;
        this.historyQueue = [];
        this.historyPointer = -1;
        this.undoQueue = [];
        this.undoPointer = -1;
    }

    excute() {}

    undo() {
        const [previousTodoList, undoObj] = this.historyQueue[this.historyPointer--];
        this.historyQueue.pop();
        const currentTodoList = JSON.parse(JSON.stringify(this.todoList));
        this.undoQueue.push([currentTodoList, undoObj]);
        this.undoPointer++;
        this.utility.save(previousTodoList);
        return undoObj;
    }

    redo() {
        const [currentTodoList, redoObj] = this.undoQueue[this.undoPointer--];
        this.utility.save(currentTodoList);
        return redoObj;
    }
}

module.exports = Command;