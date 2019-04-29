const Instruction = require('./instruction.js');
const CustomException = require('./customException.js');

const CommandParser = class {
	constructor() {
		this.instruction = new Instruction();
		this.customException = new CustomException();
	}
	
	getCmdList(input) {
    const regexp = /[^\$]+|undo|redo/g;
    return input.match(regexp);
	}
	
	executeCmd(command) {
		try {
			
			if (command.length === 1) {
				this.instruction[command[0]]();
			} else if (command.length === 2) {
				this.instruction[command[0]](command[1]);
			} else if (command.length === 3) {
				this.instruction[command[0]](command[1], command[2]);
			} else {
				this.customException.CommandMissingException();
			}		
			
		} catch (e) {
			console.error(e.message);
			return;
		}

	}

	isValidCommand(command, arr) {
		let result = false;
		if (arr.includes(command)) result = true;
		return result;
	}
};

module.exports = CommandParser;