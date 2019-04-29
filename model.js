class Model {
    constructor(initialData, MAX_HISTORY_CAPACITY) {
        this.todoList = initialData || [];
        this.historyStack = [];
        this.MAX_HISTORY_CAPACITY = MAX_HISTORY_CAPACITY;
        this.redoStack = [];
    }

    getId(key, value) {
        const targetData = this.todoList.filter(todoData => todoData[key] === value).shift();
        return targetData.id;
    }

    addData(name, tags, id, status = 'todo') {
        const todoData = {
            name,
            tags: tags.replace(/\[|\]|\"|\'/g, '').split(','),
            status: status,
            id
        }
        this.todoList.push(todoData);
        this.saveHistory('deleteData', [id]);
        return todoData;
    }

    deleteData(id) {
        const targetIndex = this.getIndex(id);
        const targetData = this.todoList[targetIndex];
        let strTags = targetData.tags.join(',');
        this.saveHistory('addData', [targetData.name, strTags, id, targetData.status]);
        this.todoList.splice(targetIndex, 1);
        return targetData;
    }

    updateData(id, status) {
        const targetIndex = this.getIndex(id);
        const targetData = this.todoList[targetIndex];
        if (targetData.status === status) throw Error(id);
        this.saveHistory('updateData', [id, targetData.status]);
        targetData.status = status;
        return targetData;
    }

    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }

    getCount(status) {
        return this.getMatchedData(status).length;
    }

    getMatchedData(status) {
        return this.todoList.filter(todoData => todoData.status === status);
    }

    getIndex(id) {
        const idx = this.todoList.findIndex(el => el.id === id);
        if (idx === -1) throw Error('MatchedDataError');
        return idx
    }

    saveHistory(keyCommand, recentData) {
        if (this.historyStack.legnth === this.MAX_HISTORY_CAPACITY) this.historyStack.shift();
        this.historyStack.push({ keyCommand, recentData });
    }

    undo() {
        if (this.historyStack.length === 0) throw Error('EmptyStackError');
        const { keyCommand, recentData } = this.historyStack.pop();
        const previousData = this[keyCommand](...recentData);
        this.redoStack.push(this.historyStack.pop());
        return { keyCommand, previousData };
    }

    redo() {
        if (this.redoStack.length === 0) throw Error('EmptyStackError');
        const { keyCommand, recentData } = this.redoStack.pop();
        const previousData = this[keyCommand](...recentData);
        return { keyCommand, previousData };

    }
}

module.exports = Model;