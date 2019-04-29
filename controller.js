class Controller {
    constructor(model, view, UPDATE_DELAY, SHOW_DELAY) {
        this.model = model;
        this.view = view;
        this.UPDATE_DELAY = UPDATE_DELAY;
        this.SHOW_DELAY = SHOW_DELAY;
    }

    showAll() {
        const countResult = {
            todo: this.model.getCount('todo'),
            doing: this.model.getCount('doing'),
            done: this.model.getCount('done')
        }
        this.view.showAll(countResult);
    }

    showEachData(status) {
        const countNumber = this.model.getCount(status);
        const targetData = this.model.getMatchedData(status);
        this.view.showEachData(status, countNumber, targetData);
    }

    showData(type) {
        if (type === 'all') {
            this.showAll();
            return
        }
        if (!/^(todo|doing|done)$/.test(type)) throw Error('ShowTypeError');
        this.showEachData(type);
    }

    async addData(name, tags) {
        const id = this.model.makeId();
        const changedData = this.model.addData(name, tags, id);
        this.view.showResult('addData', changedData);
        await this.makeDelay(this.SHOW_DELAY);
        this.showAll();
    }

    async deleteData(id) {
        const changedData = this.model.deleteData(id);
        this.view.showResult('deleteData', changedData);
        await this.makeDelay(this.SHOW_DELAY);
        this.showAll();
    }

    async updateData(id, status) {
        if (!/^(todo|doing|done)$/.test(status)) throw Error('UpdateStatusError');
        const changedData = this.model.updateData(id, status);
        await this.makeDelay(this.UPDATE_DELAY);
        this.view.showResult('updateData', changedData);
        await this.makeDelay(this.SHOW_DELAY);
        this.showAll();
    }

    makeDelay(msec) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, msec);
        })
    }

    undo() {
        const historyObj = this.model.undo();
        this.view.showUndoRedoResult(historyObj);
    }

    redo() {
        const historyObj = this.model.redo();
        this.view.showUndoRedoResult(historyObj);
    }
}

module.exports = Controller;