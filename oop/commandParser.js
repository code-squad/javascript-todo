function CommandParser () {
	
}

CommandParser.prototype = {
    
    getCmdList : (input) => {
    const regexp = /[^\$]+/g;
    return input.match(regexp);
    },
    
	executeCmd : (command) => {
		
		if (command.length === 2) {
			Instruction.prototype[command[0]](command[1]);
		} else if (command.length === 3) {
			Instruction.prototype[command[0]](command[1], command[2]);
		} else {
			// 예외처리
		}
	}
};

module.exports = CommandParser;

