const CustomException  = {
    missingSeperatorException : function(input) {
        if (!this.isValidSeperator(input)) throw new Error("구분자 $가 존재하지 않습니다");
    },
    
    notExistIdException : function() {
        throw new Error(`찾으시는 id가 존재하지 않습니다`);
    },
    
    sameStatusException : function() {
        throw new Error(`같은 상태로 업데이트 할 수 없습니다`);
    },
    
    CommandMissingException : function(command, arr) {
        if (!this.isValidCommand(command, arr))
        throw new Error(`올바른 명령어가 아닙니다`);
    },
    
    isValidSeperator : function(input) {
        let result = true;
        const regexp = /\$|undo|redo/g;
        if (input.match(regexp) == null) result = false;
        
        return result;
    },
    
    isValidCommand : function(command, arr) {
        if (arr.includes(command)) return true;
        return false;
    }
};

module.exports = CustomException;