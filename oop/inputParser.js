module.exports = class InputParser {
    constructor() {
    }

    executeTodos(todos, userInput) {
        this.splitedInput = userInput.split('$');
        this.appWord = this.splitedInput.splice(0, 1)[0];
        if (this.appWord !== 'undo' && this.appWord !== 'redo') { todos.runRecord('start') }
        return todos[this.appWord](...this.splitedInput);
    }
}