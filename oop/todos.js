//todos.js
module.exports = class Todos {
    constructor(data, userInputRecord, todosReocrd) {
        this._data = data;
        this.userInputRecord = userInputRecord;
        this.todosRecord = todosReocrd;
        this.undoNum = 0;
        this.recordPointer = 0;
        this.statusArr = ['todo', 'doing', 'done'];
    }

    makeRecordforUndo(todosObj, appWord, ...parameter) {
        console.log(this.userInputRecord);
        console.log(this.todosRecord)
        const userInputArr = [appWord, parameter];
        this.userInputRecord.unshift(userInputArr);
        this.todosRecord.unshift(todosObj);
        if(this.undoNum === 0) {
            this.userInputRecord.splice(3,1);
            this.todosRecord.splice(3,1);
        } else {
            this.userInputRecord.splice(0,this.undoNum);
            this.todosRecord.splice(0,this.undoNum);
        }
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
        } while(indexOfId != null);
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
        this.makeRecordforUndo(newObj, 'add', name, tags);
        this._data.push(newObj);
        return `'${name}' 1개가 추가됐습니다.(id : ${generatedId})`;
    }

    delete(id) {
        const indexOfTarget = this.searchById(id);
        const objOfTarget = this._data[indexOfTarget];
        this.makeRecordforUndo(objOfTarget, 'delete', id);
        this._data.splice(indexOfTarget, 1);
        return `'${objOfTarget.name}' '${objOfTarget.status}'가 목록에서 삭제됐습니다.`;
    }

    update(id, status) {
        const indexOfTarget = this.searchById(id);
        let objOfTarget = this._data[indexOfTarget];
        if (objOfTarget.status === status) {
            return '바꾸려는 상태가 현재상태와 같습니다.';
        } else {
            objOfTarget.status = status;
            this.makeRecordforUndo(objOfTarget, 'update', id, status);
            return `'${objOfTarget.name}'이(가) '${status}'으로 상태가 변경됐습니다`;
        }
    }
    
    undo(historyRecord) {
        const splitedOrder = userInput.split("$");
        const appWord = splitedOrder.splice(0, 1);
        let statusToUndo = null;
        const appWord = historyRecord.appWord;
        const objToUndo = historyRecord.objToUndo;
        switch (appWord) {
            case 'add':
                statusToUndo = 'todo';
                this.add();
            case 'delete':
                statusToUndo = '삭제';
                this.delete(this._dataObj.id);
            case 'update':
                statusToUndo = this._dataObj.status;
                this.update(this._dataObj)
        }
    };
}
