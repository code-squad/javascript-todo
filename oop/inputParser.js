module.exports = class InputParser {
    constructor() { }

    executeTodos(todos, userInput) {
        const splitedInput = userInput.split('$');
        this.appWord = splitedInput.splice(0, 1)[0];
        return todos[this.appWord](...splitedInput);
    }
}