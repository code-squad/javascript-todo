const Instruction = require('./instruction.js');
const ExceptionHandling = require('./exceptionHandling.js');

function CommandParser () {
	
}

CommandParser.prototype = {
    
    getCmdList : (input) => {
    const regexp = /[^\$]+/g;
    return input.match(regexp);
    },
    
	executeCmd : (command) => {
		try {

			if (command.length === 2) {
				Instruction.prototype[command[0]](command[1]);
			} else if (command.length === 3) {
				Instruction.prototype[command[0]](command[1], command[2]);
			} else {
				ExceptionHandling.prototype.CommandMissingException();
			}
				
		} catch (e) {
			console.error(e.message);
			return;
		}
    },
    
    isValidCommand : (command, arr) => {
        let result = false;
        if (arr.includes(command)) result = true;
        return result;
    },
};

module.exports = CommandParser;
