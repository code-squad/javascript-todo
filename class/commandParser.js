const Instruction = require('./instruction.js');
const CustomException = require('./customException.js');

const CommandParser = class {
    
    constructor() {
	    this.instruction = new Instruction();
    }
	
    getCommandList(input) {
        const regexp = /[^\$]+|undo|redo/g;
        return input.match(regexp);
    }
	
    executeCommand(command) {	    
	try {

		let [primaryCommand, firstSubCommand, secondSubCommand] = [command[0], command[1], command[2]];
		
		if (command.length === 1) {
			this.instruction[primaryCommand]();
		} else if (command.length === 2) {
			this.instruction[primaryCommand](firstSubCommand);
		} else if (command.length === 3) {
			this.instruction[primaryCommand](firstSubCommand, secondSubCommand);
		} else {
			CustomException.CommandMissingException();
		}
			
	} catch (e) {
	    console.error(e.message);
	    return;
        }
    }

    isValidCommand(command, arr) {
        if (arr.includes(command)) return true;
        return false;
    }
};

module.exports = CommandParser;