class AddManager {
    constructor(model, todoList, utility) {
        this.model = model;
        this.utility = utility
        this.historyStack = [];
        this.historyStackPointer = 0;
        this.todoList = todoList;
    }
    execute (name, tag) {
        const previousTodoList = JSON.parse(JSON.stringify(this.todoList));
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.historyStack.push([previousTodoList, objToAdd]);
        this.historyStackPointer++;
        this.model.addTodoObject(objToAdd);
        return objToAdd;
    }

    undo() {
        const [previousTodoList, undoObj] = this.historyStack[--this.historyStackPointer];
        this.utility.save(previousTodoList);
        return undoObj;
    }
}

module.exports = AddManager;