const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const Model = function () {
    this.todoList = []
}
Model.prototype = {
    findData() { },
    addData() { },
    deleteData() { },
    updateData() { },
    makeId() { }
}

const View = function () {
}
View.prototype = {
    showAll() { },
    showEachData() { },
    showAddResult() { },
    showDeleteResult() { },
    showUpdateResult() { },
}

const Controller = function () {
    this.model = model
    this.view = view
}
Controller.prototype = {
    showAll() { },
    showEachData() { },
    showData(type) {
        if (type === 'all') this.showAll()
        this.showEachData()
    },
    addData() { },
    deleteData() { },
    updateData() { },
}


const Util = function () {
}
Util.prototype = {
    parseCommand() { },
    getKeyCommand() { },
    getRestCommand() { },


}

const app = {
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ')
        rl.prompt()
        rl.on('line', (command) => {
            if (command === 'q') rl.close()
            command = util.parseCommand(command)
            const keyCommand = util.getKeyCommand(command);
            const restCommand = util.getRestCommand(command);
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