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
    addData() { },
    deleteData() { },
    updateData() { },
}


const App = {
    start() {
        rl.setPrompt()
        rl.prompt()
        rl.on('line')
    }
}

const model = new Model()
const view = new View()
const controller = new Controller()

App.start()