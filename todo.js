const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const Model = function () {
    this.todoList = []
}
Model.prototype = {
    getId(key, value) {
        const targetData = this.todoList.filter(todoData => todoData[key] === value).shift();
        return targetData.id;
    },
    addData(name, tags) {
        tags = tags.replace(/\[|\]|\"|\'/g, '').split(',')
        const id = this.makeId()
        const todoData = {
            name,
            tags,
            status: 'todo',
            id
        }
        this.todoList.push(todoData)
    },
    deleteData(id) {
        const targetIndex = this.getIndex(id)
        this.todoList.splice(targetIndex, 1)
    },
    updateData(id, status) {
        const targetIndex = this.getIndex(id);
        let targetData = this.todoList[targetIndex];
        if (targetData.status === status) throw Error(id)
        targetData.status = status
    },
    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
    },
    countData(status) {
        return this.getMatchedData(status).length
    },
    getMatchedData(status) {
        return this.todoList.filter(todoData => todoData.status === status)
    },
    getIndex(id) {
        const idx = this.todoList.findIndex(el => el.id === id)
        if (idx === -1) throw Error('MatchedDataError')
        return idx
    }
}

const View = function () {
    this.blueColor = '\x1b[36m%s\x1b[0m'
}
View.prototype = {
    showAll(countResult) {
        console.log(this.blueColor, '현재상태 : ' + Object.entries(countResult).map(([key, value]) => `${key}: ${value}개`).join(', '))
    },
    showEachData(status, countNumber, targetData) {
        const str = targetData.map(el => `'${el.name}, ${el.id}번'`).join(', ')
        console.log(this.blueColor, `${status}리스트 : 총 ${countNumber}건 : ${str}`)
    },
    showAddResult(name, id) {
        console.log(this.blueColor, `${name} 1개가 추가되었습니다. (id : ${id})`)
    },
    showDeleteResult(name, status) {
        console.log(this.blueColor, `${name} ${status}가 목록에서 삭제되었습니다.`)
    },
    showUpdateResult(name, status) {
        console.log(this.blueColor, `${name}이(가) ${status}으로 상태가 변경되었습니다.`)
    },
}

const Controller = function () {
    this.model = model
    this.view = view
}
Controller.prototype = {
    showAll() {
        const countResult = {
            todo: this.model.countData('todo'),
            doing: this.model.countData('doing'),
            done: this.model.countData('done')
        }
        this.view.showAll(countResult)
        rl.prompt()
    },
    showEachData(status) {
        const countNumber = this.model.countData(status)
        const targetData = this.model.getMatchedData(status)
        this.view.showEachData(status, countNumber, targetData)
        rl.prompt()
    },
    showData(type) {
        if (type === 'all') {
            this.showAll()
            return
        }
        if (!/^(todo|doing|done)$/.test(type)) throw Error('ShowTypeError')
        this.showEachData(type)
    },
    addData(name, tags) {
        this.model.addData(name, tags);
        const id = this.model.getId('name', name)
        this.view.showAddResult(name, id);
        this.showFinalResult()
    },
    deleteData(id) {
        const idx = this.model.getIndex(id);
        const {
            name,
            status
        } = this.model.todoList[idx]
        this.model.deleteData(id)
        this.view.showDeleteResult(name, status)
        this.showFinalResult()
    },
    updateData(id, status) {
        if (!/^(todo|doing|done)$/.test(status)) throw Error('UpdateStatusError')
        this.model.updateData(id, status);
        const idx = this.model.getIndex(id)
        const name = this.model.todoList[idx].name
        setTimeout(() => {
            this.view.showUpdateResult(name, status)
            this.showFinalResult()
        }, 3000);
    },
    showFinalResult() {
        setTimeout(() => { this.showAll() }, 1000);
    }
}

const Util = function () { }
Util.prototype = {
    parseCommand(command) {
        if (!/\$/.test(command)) throw Error('DollarCharError')
        return command.split('$');
    },
    getKeyCommand(command) {
        const KeyMap = {
            'show': 'showData',
            'add': 'addData',
            'delete': 'deleteData',
            'update': 'updateData'
        }
        const keyCommand = command.shift();
        return KeyMap[keyCommand]
    },
    checkArgsNumber(keyCommand, restCommand) {
        const argsNumber = {
            showData: 1,
            addData: 2,
            deleteData: 1,
            updateData: 2
        }
        if (argsNumber[keyCommand] !== restCommand.length) throw Error('MaxArgsNumberError')
    }
}

const ErrorHandler = function () {
    this.controller = controller;
    this.redColor = '\x1b[31m%s\x1b[0m'
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
        console.log(this.redColor, '올바른 명령기호($)를 사용해 주세요.')
    },
    printMatchedDataError() {
        console.log(this.redColor, '일치하는 id가 없습니다.')
    },
    printSameStatusError(id) {
        const idx = this.controller.model.getIndex(id);
        const {
            name,
            status
        } = this.controller.model.todoList[idx];
        console.log(this.redColor, `${name}의 status는 이미 ${status}입니다.`)
    },
    printOtherErrors() {
        console.log(this.redColor, '올바른 명령어를 사용해주세요.')
    },
    printShowTypeError() {
        console.log(this.redColor, 'show 명령의 옵션은 all/todo/doing/done 중 하나로 입력해 주세요.')
    },
    printUpdateStatusError() {
        console.log(this.redColor, 'update 명령의 status는 todo/doing/done 중 하나로 입력해 주세요.')
    },
    printMaxArgsNumberError() {
        console.log(this.redColor, '인자 개수를 확인해주세요.')
    }
}

const util = new Util();
const model = new Model();
const view = new View();
const controller = new Controller();
const errorHandler = new ErrorHandler();

const app = {
    util: util,
    controller: controller,
    errorHandler: errorHandler,
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ')
        rl.prompt()
        rl.on('line', (command) => {
            if (command === 'q') rl.close()
            try {
                command = this.util.parseCommand(command)
                const keyCommand = this.util.getKeyCommand(command);
                const restCommand = command;
                this.util.checkArgsNumber(keyCommand, restCommand);
                this.controller[keyCommand](...restCommand);
            }
            catch (e) {
                const errorType = this.errorHandler.getErrorType(e.message)
                if (errorType) {
                    this.errorHandler[errorType](e.message)
                    rl.prompt()
                } else {
                    this.errorHandler.printOtherErrors();
                    rl.prompt()
                }
            }
        })
        rl.on('close', () => {
            process.exit()
        })
    }
}

app.start()