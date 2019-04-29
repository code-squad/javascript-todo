class ErrorHandler {
    constructor(controller, fontColor, ID_LENGTH) {
        this.controller = controller;
        this.fontColor = fontColor;
        this.ID_LENGTH = ID_LENGTH;

        this.errorMsgMap = {
            DollarCharError: '올바른 명령기호($)를 사용해 주세요.',
            MatchedDataError: '일치하는 id가 없습니다.',
            ShowTypeError: 'show 명령의 옵션은 all/todo/doing/done 중 하나로 입력해 주세요.',
            UpdateStatusError: 'update 명령의 status는 todo/doing/done 중 하나로 입력해 주세요.',
            ArgsNumberError: '인자 개수를 확인해주세요.',
            EmptyStackError: '되돌릴 명령이 없습니다.'
        }
    }

    printErrorMessage(errorMsg) {
        if (errorMsg.length === this.ID_LENGTH) return this.printSameStatusError(errorMsg);
        if (!this.errorMsgMap[errorMsg]) return console.log(this.fontColor, '올바른 명령어를 사용해주세요.');
        console.log(this.fontColor, this.errorMsgMap[errorMsg]);
    }

    printSameStatusError(id) {
        const idx = this.controller.model.getIndex(id);
        const { name, status } = this.controller.model.todoList[idx];
        console.log(this.fontColor, `${name}의 status는 이미 ${status}입니다.`)
    }
}

module.exports = ErrorHandler;