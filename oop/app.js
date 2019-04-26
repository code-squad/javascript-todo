const Todo = module.require('./todo.js');
const todoList = module.require('./data.js');
const readline = require('readline');
const errorMessage = module.require('./errorMessage.js');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const myTodo = new Todo(todoList, rl);

rl.setPrompt('명령하세요 : ');

rl.prompt();

rl.on('line', input => {
	excuteTodo(input);
});

const excuteTodo = input => {
	try {
		const inputArray = input.split('$');
		if (inputArray.length > 3) {
			throw new Error('COMMAND_ERROR');
		}
		const action = inputArray.splice(0, 1)[0];
		const condition = inputArray;
		const regExp = /^show$|^add$|^delete$|^update$|^undo$|^redo$/;
		const matchRegExp = action.match(regExp);

		if (matchRegExp === null) {
			throw new Error('COMMAND_ERROR');
		} else {
			myTodo[action](...condition);
		}
	} catch (e) {
		console.log(errorMessage[e.message]);
		rl.prompt();
	}
};
