const Todo = module.require('./todo.js');
const readline = require('readline');
const errorMessage = module.require('./errorMessage.js');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const myTodo = new Todo(rl);

rl.setPrompt('명령하세요 : ');

rl.prompt();
rl.on('line', input => {
	const inputArray = input.split('$');
	if (inputArray.length === 1 || inputArray.length > 3) {
		return myTodo.printError('COMMAND_ERROR');
	}
	const action = inputArray.splice(0, 1)[0];
	const condition = inputArray;

	excuteTodo(action, condition);
});

const excuteTodo = (action, condition) => {
	const regExp = /^show$|^add$|^delete$|^update$/;
	const matchRegExp = action.match(regExp);

	try {
		if (matchRegExp === null) {
			throw new Error(errorMessage.COMMAND_ERROR);
		} else {
			myTodo[action](...condition);
		}
	} catch (e) {
		console.log(e.message);
		rl.prompt();
	}
};
