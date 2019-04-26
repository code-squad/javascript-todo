// ',' 문자가 없는 경우 에러 검증 및 발생
class TodoError {
    findSeparator(action, input) {
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
    
    findWrongStatus(statusOfShow, statusOfUpdate) {
        const statusCheck = ['todo', 'doing', 'done', 'all'];
        const validStatus = statusOfUpdate||statusOfShow;
    
        if(!statusCheck.includes(validStatus)) {
            throw new Error('Status를 확인해주세요.');
        }    
    }
        
    actionCheck(action) {
        if (action !== 'add' && action !== 'delete' && action !== 'update' && action !== 'show' && action !== 'redo' && action !== 'undo') {
            throw new Error ('처음값 add, delete, update, show 중 하나로 입력해주세요.')
        }
    }
    
    sameStatusCheck(that, id, inputStatus) {
        const validId = parseInt(id);
        const [matchedListById] = this.checkID(validId, that);
        if (inputStatus === matchedListById.status) {
            throw new Error ('status가 동일합니다. 변경될 status를 입력해주세요.')
        }
    }
    
    idValidation(that, rest) {
        const id = rest[0];
        const validId = parseInt(id);
        const [matchedListById] = this.checkID(validId, that);
        if(matchedListById === undefined) {
            throw new Error ('ID값을 확인해주세요');
        }
    }
    
    printError(input, that) {
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
    
    checkID(id, that) {
        const matchedListById = that.data.filter(list => {
            return list.id === id
        })
        return matchedListById
    }

    deletedItemCheck (that) {
        if ( that.deletedData.length === 0 ) {
            throw new Error ('undo할 값이 없습니다.')
        }
    }

    wasdeletedItemCheck (that) {
        if (!that.data[that.data.length-1].wasDeleted) {
            throw new Error ('redo할 값이 없습니다.')
        }
    }
}

module.exports = TodoError;