const Instruction = require('./instruction.js');
const CustomException = require('./customException.js');

function CommandParser () {
	this.instruction = new Instruction();
	this.customException = new CustomException();
}

CommandParser.prototype = {
	getCmdList(input) {
    const regexp = /[^\$]+/g;
    return input.match(regexp);
	},
	
	executeCmd(command) {
		try {
			
			if (command.length === 2) {
				instruction[command[0]](command[1]);
			} else if (command.length === 3) {
				instruction[command[0]](command[1], command[2]);
			} else {
				customException.CommandMissingException();
			}		
			
		} catch (e) {
			console.error(e.message);
			return;
		}

	},

	isValidCommand(command, arr) {
		let result = false;
		if (arr.includes(command)) result = true;
		return result;
	},
};

module.exports = CommandParser;