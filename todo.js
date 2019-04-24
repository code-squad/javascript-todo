const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const Model = function () {
    this.todoList = []
}
Model.prototype = {
    findData(key, value) {
        return this.todoList.filter(todoData => todoData[key] === value)
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
    updateData() { },
    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
    },
    countData(status) {
        return this.todoList.filter(todoData => todoData.status === status).length
    },
    getMatchedData(status) {
        return this.findData('status', status).map(el => `'${el.name}, ${el.id}번'`).join(', ')
    },
    getIndex(id) {
        return this.todoList.findIndex(el => el.id === id)
    }


}

const View = function () {
}
View.prototype = {
    showAll(countResult) {
        console.log('현재상태 : ' + Object.entries(countResult).map(([key, value]) => `${key}: ${value}개`).join(', '))
    },
    showEachData(status, countNumber, targetData) {
        console.log(`${status}리스트 : 총 ${countNumber}건 : ${targetData}`)

    },
    showAddResult(name, id) {
        console.log(`${name} 1개가 추가되었습니다. (id : ${id})`)
    },
    showDeleteResult(name, status) {
        console.log(`${name} ${status}가 목록에서 삭제되었습니다.`)

    },
    showUpdateResult() { },
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
    },
    showEachData(status) {
        const countNumber = this.model.countData(status)
        const targetData = this.model.getMatchedData(status)
        this.view.showEachData(status, countNumber, targetData)
    },
    showData(type) {
        if (type === 'all') {
            this.showAll()
            return
        }
        this.showEachData(type)
    },
    addData(name, tags) {
        this.model.addData(name, tags);
        const id = this.model.findData('name', name)[0].id
        this.view.showAddResult(name, id);
    },
    deleteData(id) {
        const {
            name,
            status
        } = this.model.findData('id', id)[0]
        this.model.deleteData(id)
        this.view.showDeleteResult(name, status)
    },
    updateData() { },
}


const Util = function () {
}
Util.prototype = {
    parseCommand(command) {
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
    }
}

const app = {
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ')
        rl.prompt()
        rl.on('line', (command) => {
            if (command === 'q') rl.close()
            command = util.parseCommand(command)
            const keyCommand = util.getKeyCommand(command);
            const restCommand = command;
            controller[keyCommand](...restCommand)
            rl.prompt()
        })
        rl.on('close', () => {
            process.exit()
        })
    }
}

const util = new Util();
const model = new Model();
const view = new View();
const controller = new Controller();

app.start()