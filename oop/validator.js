//validator.js
module.exports = class Validator {
    constructor(data) {
        this._data = data;
    }
    
    initOrder() {
        this._seperator = this._order.match(/\$/g);
        this._appWord = this._order.match(/[a-z]*(?=\$)/);
        this._status = this._order.match(/(?<=\$)[a-z]*$/);
        this._id = this._order.match(/(?<=\$)\d*/);
        this._tag = this._order.match(/(?<=\[\")\w*(?=\"\])/);
    }

    validateSeparator() { return '명령어를 $로 구분해주세요.'; }
    validateAppWord() { return '잘못된 appWords 입니다.'; }
    validateTag() { if (!this._tag) return '가능한 tag가 아닙니다.'; }
    validateId() {
        let existId = this._data.some((element) => element.id === Number(this._id[0]));
        if (!existId) return '존재하지 않는 id입니다.';
    }
    validateStatus() {
        const statusList = ['all', 'todo', 'doing','done'];
        if (statusList.indexOf(this._status[0]) === -1) return '잘못된 status입니다.';
    }

    excuteValidation(order) {
        this._order = order;
        this.initOrder();
        if (!this._seperator){ return this.validateSeparator(); }
        switch (this._appWord[0]) {
            case 'show':
                return this.validateStatus();
            case 'add':
                return this.validateTag();
            case 'delete':
                return this.validateId();
            case 'update':
                return this.validateId() || this.validateStatus(); 
            default :
                return this.validateAppWord();
        }
    }
};