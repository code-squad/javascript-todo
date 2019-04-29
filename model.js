const Model = function (initialData) {
    this.todoList = initialData || [];
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
        return todoData;
    },
    deleteData(id) {
        const targetIndex = this.getIndex(id)
        const targetData = this.todoList[targetIndex];
        this.todoList.splice(targetIndex, 1)
        return targetData;
    },
    updateData(id, status) {
        const targetIndex = this.getIndex(id);
        const targetData = this.todoList[targetIndex];
        if (targetData.status === status) throw Error(id)
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
    }
}
module.exports = Model;