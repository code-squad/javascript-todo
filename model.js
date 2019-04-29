const Model = function (initialData, MAX_HISTORY_CAPACITY) {
    this.todoList = initialData || [];
    this.historyStack = [];
    this.MAX_HISTORY_CAPACITY = MAX_HISTORY_CAPACITY;
}
Model.prototype = {
    getId(key, value) {
        const targetData = this.todoList.filter(todoData => todoData[key] === value).shift();
        return targetData.id;
    },
    addData(name, tags, id, status = 'todo') {
        const todoData = {
            name,
            tags: tags.replace(/\[|\]|\"|\'/g, '').split(','),
            status: status,
            id
        }
        this.todoList.push(todoData);
        this.saveHistory('deleteData', todoData)
        return todoData;
    },
    deleteData(id) {
        const targetIndex = this.getIndex(id)
        const targetData = this.todoList[targetIndex];
        this.todoList.splice(targetIndex, 1)
        this.saveHistory('addData', targetData)
        return targetData;
    },
    updateData(id, status) {
        const targetIndex = this.getIndex(id);
        const targetData = this.todoList[targetIndex];
        if (targetData.status === status) throw Error(id)
        this.saveHistory('updateData', targetData)
        targetData.status = status
        return targetData;
    },
    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
    },
    getCount(status) {
        return this.getMatchedData(status).length
    },
    getMatchedData(status) {
        return this.todoList.filter(todoData => todoData.status === status)
    },
    getIndex(id) {
        const idx = this.todoList.findIndex(el => el.id === id)
        if (idx === -1) throw Error('MatchedDataError')
        return idx
    },
    saveHistory(keyCommand, recentData) {
        if (this.historyStack.legnth === this.MAX_HISTORY_CAPACITY) this.historyStack.shift();
        this.historyStack.push({ keyCommand, recentData })
    },

    undo() {
        if(this.historyStack.length === 0) throw Error('EmptyStackError')
        const { keyCommand, recentData } = this.historyStack.pop();
        let { id, name, status, tags } = recentData;
        tags = tags.join(',')
        let previousData = {};
        if (keyCommand === 'addData') previousData = this.addData(name, tags, id, status)
        if (keyCommand === 'deleteData') previousData = this.deleteData(id)
        if (keyCommand === 'updateData') previousData = this.updateData(id, status)
        this.historyStack.pop()
        return { keyCommand, previousData }
    }
}
module.exports = Model;