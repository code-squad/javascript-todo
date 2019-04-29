function CustomException() {

}

CustomException.prototype = {
	
	missingSeperatorException (input) {
		if (!this.isValidSeperator(input)) throw new Error("구분자 $가 존재하지 않습니다");
	},
	notExistIdException () {
		throw new Error(`찾으시는 id가 존재하지 않습니다`);
	},
	sameStatusException () {
		throw new Error(`같은 상태로 업데이트 할 수 없습니다`);
	},
	
	CommandMissingException (command, arr) {
		if (!this.isValidCommand(command, arr))
		throw new Error(`올바른 명령어가 아닙니다`);
	},
	
	isValidSeperator (input) {
		let result = true;
		const regexp = /\$/g;
		if (input.match(regexp) == null) result = false;
		
		return result;
	},
	isValidCommand(command, arr) {
    let result = false;
    if (arr.includes(command)) result = true;
    return result;
	},

};

module.exports = CustomException;