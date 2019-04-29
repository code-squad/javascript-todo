const Controller = function (model, view, UPDATE_DELAY, SHOW_DELAY) {
    this.model = model;
    this.view = view;
    this.UPDATE_DELAY = UPDATE_DELAY;
    this.SHOW_DELAY = SHOW_DELAY;

}
Controller.prototype = {
    showAll() {
        const countResult = {
            todo: this.model.getCount('todo'),
            doing: this.model.getCount('doing'),
            done: this.model.getCount('done')
        }
        this.view.showAll(countResult)
    },
    showEachData(status) {
        const countNumber = this.model.getCount(status)
        const targetData = this.model.getMatchedData(status)
        this.view.showEachData(status, countNumber, targetData)
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
        const changedData = this.model.addData(name, tags, id);
        this.view.showResult('addData', changedData);
        this.showFinalResult()
    },
    deleteData(id) {
        const changedData = this.model.deleteData(id)
        this.view.showResult('deleteData', changedData);
        this.showFinalResult()
    },
    updateData(id, status) {
        if (!/^(todo|doing|done)$/.test(status)) throw Error('UpdateStatusError')
        const changedData = this.model.updateData(id, status);
        setTimeout(() => {
            this.view.showResult('updateData', changedData)
            this.showFinalResult()
        }, this.UPDATE_DELAY);
    },
    showFinalResult() {
        setTimeout(() => { this.showAll() }, this.SHOW_DELAY);
    },
    undo () {
        const historyObj = this.model.undo();
        this.view.showUndoRedoResult(historyObj);
    }
}
module.exports = Controller;