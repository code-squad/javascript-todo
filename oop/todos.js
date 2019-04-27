//todos.js
module.exports = class Todos {
    constructor(data) {
        this._data = data;
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
        this._data.push(newObj);
        return `'${name}' 1개가 추가됐습니다.(id : ${generatedId})`;
    }

    delete(id) {
        const indexOfTarget = this.searchById(id);
        let objOfTarget = this._data[indexOfTarget];
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
            return `'${objOfTarget.name}'이(가) '${status}'으로 상태가 변경됐습니다`;
        }
    }
};
