const TodoError = function(thisOfTodoMain) {
    this.that = thisOfTodoMain;
}

TodoError.prototype.printError = function (input) {
    const [action, ...rest] = input.split(',');
        this.checkAction(action);
        this.findSeparator(action,input);
    if(action === 'update') {
        this.checkSameStatus(...rest);
        this.findWrongStatus(...rest);
        this.idValidator(rest);
    }
    if(action === 'delete') {
        this.idValidator(rest);
    }
    if(action === 'show') {
        this.findWrongStatus(...rest);
    }
    if(action === 'redo') {
        this.cantRedo();
    }
    if(action === 'undo') {
        this.cantUndo();
    }
}
// '$' 문자가 없는 경우 에러 처리
TodoError.prototype.findSeparator = function(action, input) {
    const splitOfInput = input.split('');
    const countComma = splitOfInput.filter(n => {
        return n === ','
    })
    if(action === 'add' || action === 'update') {
        if(countComma.length !== 2) throw new Error('인자값이 부족합니다. 확인해주세요.')
    }
    if (action === 'delete' || action == 'show') {
        if(countComma.length !== 1) throw new Error('인자값이 부족합니다. 확인해주세요.')
    }
    if (action === 'undo' || action == 'redo') {
        if(countComma.length >= 1) throw new Error('인자값을 확인해주세요.')
    }
}

TodoError.prototype.findWrongStatus = function(statusOfShow, statusOfUpdate) {
    const statusCheck = ['todo', 'doing', 'done', 'all'];
    const validStatus = statusOfUpdate||statusOfShow;

    if(!statusCheck.includes(validStatus)) {
        throw new Error('Status를 확인해주세요.');
    }    
}

TodoError.prototype.checkAction = function(action) {
    let allActionArray = ['add', 'delete', 'update', 'show', 'redo', 'undo'];
    if (!allActionArray.includes(action)) {
        throw new Error ('처음값 add, delete, update, show 중 하나로 입력해주세요.')
    }
}

TodoError.prototype.checkSameStatus = function(id, inputStatus) {
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId);
    if (inputStatus === matchedListById.status) {
        throw Error ('status가 동일합니다. 변경될 status를 입력해주세요.')
    }
}

TodoError.prototype.idValidator = function(rest) {
    const id = rest[0];
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId);
    if(matchedListById === undefined) {
        throw Error ('ID값을 확인해주세요');
    }
}

TodoError.prototype.cantRedo = function() {
    if (this.that.pointer === this.that.history.length) throw new Error ('더이상 redo를 할 수 없습니다.');
}

TodoError.prototype.cantUndo = function() {
    if (this.that.pointer === 0) throw new Error ('더이상 undo를 할 수 없습니다.');
}

TodoError.prototype.checkID = function(id) {
    const matchedListById = this.that.data.filter(list => {
        return list.id === id
    })
    return matchedListById
}


module.exports = TodoError;