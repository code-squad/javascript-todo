//validator.js
function Validator(data) {
    this._data = data;
}

Validator.prototype.initOrder = function () {
    this._undoWord = this._userInput.match(/^undo$|^redo$/);
    this._seperator = this._userInput.match(/\$/g);
    this._appWord = this._userInput.match(/^show|^add|^delete|^update/);
    this._status = this._userInput.match(/(?<=\$)[a-z]*$/);
    this._id = this._userInput.match(/(?<=\$)\d*/);
    this._tag = this._userInput.match(/(?<=\[)[\d\D]+(?=\])/);
    this._name = this._userInput.match(/(?<=\$)[\d\D]*(?=\$)/);
};

Validator.prototype.validateUndoWord = function () { return null };
Validator.prototype.validateSeparator = function () { return '각각의 명령어를 $로 구분해주세요.' };
Validator.prototype.validateAppWord = function () { return '잘못된 appWords 입니다.' };
Validator.prototype.validateTag = function () { if (!this._tag) return '가능한 tag형식이 아닙니다.' };
Validator.prototype.validateName = function () { if (!this._name) return '가능한 name형식이 아닙니다.' };
Validator.prototype.validateId = function () {
    let existId = this._data.some((element) => element.id === Number(this._id[0]));
    if (!existId) return '존재하지 않는 id입니다.'
};
Validator.prototype.validateStatus = function () {
    const statusList = ['all', 'todo', 'doing', 'done'];
    if (statusList.indexOf(this._status[0]) === -1) return '가능한 status 형식이 아닙니다.'
};

Validator.prototype.excuteValidation = function (userInput) {
    this._userInput = userInput;
    this.initOrder();

    if (this._undoWord) { return this.validateUndoWord(); }
    if (!this._appWord) { return this.validateAppWord(); }
    if (!this._seperator) { return this.validateSeparator(); }
    switch (this._appWord[0]) {
        case 'show':
            return this.validateStatus()
        case 'add':
            return this.validateName() || this.validateTag()
        case 'delete':
            return this.validateId()
        case 'update':
            return this.validateId() || this.validateStatus()
    }
};
module.exports = Validator;