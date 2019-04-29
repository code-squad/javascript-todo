const ErrorHandler = function (controller, fontColor) {
    this.controller = controller;
    this.fontColor = fontColor;
}
ErrorHandler.prototype = {
    getErrorType(errorMsg) {
        if (errorMsg.length === 4) errorMsg = 'SameStatusError'

        const ErrorType = {
            DollarCharError: 'printDollarCharError',
            MatchedDataError: 'printMatchedDataError',
            SameStatusError: 'printSameStatusError',
            ShowTypeError: 'printShowTypeError',
            UpdateStatusError: 'printUpdateStatusError',
            MaxArgsNumberError: 'printMaxArgsNumberError'
        }
        return ErrorType[errorMsg]
    },

    printDollarCharError() {
        console.log(this.fontColor, '올바른 명령기호($)를 사용해 주세요.')
    },
    printMatchedDataError() {
        console.log(this.fontColor, '일치하는 id가 없습니다.')
    },
    printSameStatusError(id) {
        const idx = this.controller.model.getIndex(id);
        const {
            name,
            status
        } = this.controller.model.todoList[idx];
        console.log(this.fontColor, `${name}의 status는 이미 ${status}입니다.`)
    },
    printOtherErrors() {
        console.log(this.fontColor, '올바른 명령어를 사용해주세요.')
    },
    printShowTypeError() {
        console.log(this.fontColor, 'show 명령의 옵션은 all/todo/doing/done 중 하나로 입력해 주세요.')
    },
    printUpdateStatusError() {
        console.log(this.fontColor, 'update 명령의 status는 todo/doing/done 중 하나로 입력해 주세요.')
    },
    printMaxArgsNumberError() {
        console.log(this.fontColor, '인자 개수를 확인해주세요.')
    }
}