//todos.js
module.exports = class Todos {
    constructor(data, userInputRecord, todosReocrd) {
        this._data = data;
        this.userInputRecord = userInputRecord;
        this.todosRecord = todosReocrd;
        this.recordPointer = 0;
        this.recordSwitch = 1;
        this.statusArr = ['todo', 'doing', 'done'];
    }

    randomNum(digits) {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    searchById(id) {
        let resultIndex = null;
        this._data.forEach((value, index) => {
            if (value.id == id) resultIndex = index;
        });
        return resultIndex;
    }

    makeUniqueNum(digits) {
        let generatedId = -1;
        let indexOfId = -1;
        do {
            generatedId = this.randomNum(digits);
            indexOfId = this.searchById(generatedId);
        } while (indexOfId != null);
        return generatedId;
    }

    countAllStatus() {
        let resultObject = {
            todo: 0,
            doing: 0,
            done: 0
        };
        this._data.forEach(value => resultObject[value.status] += 1);
        return resultObject;
    }

    searchByStatus(status) {
        let resultArr = [];
        this._data.forEach(value => {
            if (value.status === status) resultArr.push(`'${value.name}, ${value.id}번'`);
        });
        return resultArr;
    }

    show(status) {
        if (status === "all") {
            const statusCountObject = this.countAllStatus();
            return `현재상태 : todo: ${statusCountObject.todo}개, doing: ${statusCountObject.doing}개, done: ${statusCountObject.done}개`;
        } else if (this.statusArr.includes(status)) {
            const statusArr = this.searchByStatus(status);
            return `${status}리스트 :  총 ${statusArr.length}건 : ${statusArr.join(', ')}`;
        }
    }

    add(name, tags) {
        let generatedId = this.makeUniqueNum(5);
        let newObj = {
            name,
            tags,
            status: "todo",
            id: generatedId
        };
        if (this.recordSwitch) { this.storeHistoryRecord(newObj, 'add', name, tags); }
        this._data.push(newObj);
        return `'${name}' 1개가 추가됐습니다.(id : ${generatedId})`;
    }

    delete(id) {
        const indexOfTarget = this.searchById(id);
        const objOfTarget = this._data[indexOfTarget];
        if (this.recordSwitch) { this.storeHistoryRecord(objOfTarget, 'delete', id); }
        this._data.splice(indexOfTarget, 1);
        return `'${objOfTarget.name}' '${objOfTarget.status}'가 목록에서 삭제됐습니다.`;
    }

    update(id, status) {
        const indexOfTarget = this.searchById(id);
        let objOfTarget = this._data[indexOfTarget];
        if (objOfTarget.status === status) {
            return '바꾸려는 상태가 현재상태와 같습니다.';
        } else {
            if (this.recordSwitch) { this.storeHistoryRecord(objOfTarget, 'update', id, status, objOfTarget.status); }
            objOfTarget.status = status;
            return `'${objOfTarget.name}'이(가) '${status}'으로 상태가 변경됐습니다`;
        }
    }

    moveRecordPointer(appWord) {
        switch (appWord) {
            case 'undo':
                this.recordPointer++
                break;
            case 'redo':
                this.recordPointer--;
                break;
        }
    }

    limitRecordPointer(appWord) {
        switch (appWord) {
            case 'undo':
                return this.recordPointer < this.todosRecord.length;
            case 'redo':
                return this.recordPointer <= this.todosRecord.length && this.recordPointer > 0
        }
    }

    recordSequential(todosObj, userInputArr) {
        this.userInputRecord.unshift(userInputArr);
        this.todosRecord.unshift(todosObj);
        this.userInputRecord.splice(3, 1);
        this.todosRecord.splice(3, 1);
    }

    recordUnsequential(todosObj, userInputArr) {
        this.userInputRecord.splice(0, this.recordPointer);
        this.todosRecord.splice(0, this.recordPointer);
        this.userInputRecord.unshift(userInputArr);
        this.todosRecord.unshift(todosObj);
        this.recordPointer = 0;
    }

    storeHistoryRecord(todosObj, appWord, ...parameter) {
        const userInputArr = [appWord, parameter];
        if (this.recordPointer === 0) {
            this.recordSequential(todosObj, userInputArr);
        } else {
            this.recordUnsequential(todosObj, userInputArr);
        }
    }
    
    runRecord(order) {
        switch (order) {
            case 'start':
                this.recordSwitch = 1;
                break;
            case 'stop':
                this.recordSwitch = 0;
                break;
        }
    }

    addDeletedObj(todosObj, data) {
        data.push(todosObj);
    }

    undo() {
        if (this.limitRecordPointer('undo')) {
            const pointer = this.recordPointer;
            const userinput = this.userInputRecord[pointer];
            const todosObj = this.todosRecord[pointer];
            const appWord = userinput[0];
            const appParameterArr = userinput[1];
            this.runRecord('stop');
            this.moveRecordPointer('undo');
            switch (appWord) {
                case 'add':
                    this.delete(todosObj.id);
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 todo에서 삭제되었습니다.`;
                case 'delete':
                    this.addDeletedObj(todosObj, this._data);
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 삭제에서 todo상태로 되었습니다.`;
                case 'update':
                    const originalStatus = appParameterArr[2];
                    this.update(...appParameterArr);
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 ${todosObj.status}에서 ${originalStatus}상태로 되었습니다.`;
            }
        } else { return 'undo할 항목이 없습니다.' }
    }

    redo() {
        if (this.limitRecordPointer('redo')) {
            const pointer = this.recordPointer - 1;
            const userinput = this.userInputRecord[pointer];
            const todosObj = this.todosRecord[pointer];
            const appWord = userinput[0];
            const appParameterArr = userinput[1];
            this.moveRecordPointer('redo');
            switch (appWord) {
                case 'add':
                    this.addDeletedObj(todosObj, this._data);
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 삭제에서 todo상태로 되었습니다.`;
                case 'delete':
                    this.delete(todosObj.id)
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 todo에서 삭제되었습니다.`;
                case 'update':
                    const originalStatus = appParameterArr[2];
                    this.update(...appParameterArr)
                    return `'${todosObj.id}번, ${todosObj.name}' 항목이 ${originalStatus}에서 ${todosObj.status}상태로 되었습니다.`;
            }
        } else {
            return 'redo할 항목이 없습니다.'
        }
    }
}
