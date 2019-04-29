const Controller = function (model,view) {
    this.model = model;
    this.view = view;
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
        const id = this.model.makeId()
        this.model.addData(name, tags, id);
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