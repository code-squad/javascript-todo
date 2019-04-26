const TodoError = function() {

}

// '$' 문자가 없는 경우 에러 처리
TodoError.prototype.findSeparator = function(action, input) {
    const splitOfInput = input.split('');
    const countComma = splitOfInput.filter(n => {
        return n === ','
    })
    if(action === 'add' || action === 'update') {
        if(countComma.length !== 2) throw Error('인자값이 부족합니다. 확인해주세요.')
    }
    if (action === 'delete' || action == 'show') {
        if(countComma.length !== 1) throw Error('인자값이 부족합니다. 확인해주세요.')
    }
}

TodoError.prototype.findWrongStatus = function(statusOfShow, statusOfUpdate) {
    

    if(statusOfUpdate !== undefined){
        if(statusOfUpdate !== 'todo' && 
           statusOfUpdate !== 'doing' &&
           statusOfUpdate !== 'done') {
                throw Error('Status를 확인해주세요.');
        }
    }

    if(statusOfUpdate === undefined){
        if(statusOfShow !== 'todo' && 
           statusOfShow !== 'doing' &&
           statusOfShow !== 'done' &&
           statusOfShow !== 'all') {
                throw Error('Status를 확인해주세요.');
        }
    }
    
}


TodoError.prototype.actionCheck = function(action) {
    if (action !== 'add' && action !== 'delete' && action !== 'update' && action !== 'show') {
        throw Error ('처음값 add, delete, update, show 중 하나로 입력해주세요.')
    }
}


TodoError.prototype.sameStatusCheck = function (that, id, inputStatus) {
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId, that);
    if (inputStatus === matchedListById.status) {
        throw Error ('status가 동일합니다. 변경될 status를 입력해주세요.')
    }
}

TodoError.prototype.idValidation = function (that, rest) {
    const id = rest[0];
    const validId = parseInt(id);
    const [matchedListById] = this.checkID(validId, that);
    if(matchedListById === undefined) {
        throw Error ('ID값을 확인해주세요');
    }
}

TodoError.prototype.printError = function (input, that) {
    const [action, ...rest] = input.split(',');
        this.actionCheck(action);
        this.findSeparator(action,input);
    if ( action === 'update') {
        this.sameStatusCheck(that, ...rest);
        this.findWrongStatus(...rest);
        this.idValidation(that, rest);
    }
    if ( action === 'delete') {
        this.idValidation(that, rest);
    }
    if (action === 'show') {
        this.findWrongStatus(...rest);
    }
}

TodoError.prototype.checkID = function (id, that) {
    const matchedListById = that.data.filter(list => {
        return list.id === id
    })
    return matchedListById
}




module.exports = TodoError;