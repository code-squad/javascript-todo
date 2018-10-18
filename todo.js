const todo = {
    todoList: [],

    statusNum: {
        todo: 0,
        doing: 0,
        done: 0
    },//statusNum

    initStatusNum() {
        this.statusNum.todo = 0;
        this.statusNum.doing = 0;
        this.statusNum.done = 0;
    },//for statusNum

    getStatusNum(accumulatedTask) {
        this.initStatusNum();
        accumulatedTask.forEach(obj => {
            this.statusNum[obj.status]++
        })
    },//for statusNum

    add(objToAdd) {
        const newTodo = {
            id: this.getRanNum(this.todoList),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag,
            timeData: 0,
        }
        todoTask.push(this.checkTag(newTodo));
    },//add

    getRanNum(todoList) {
        const ranNum = Math.floor(Math.random() * 6)
        const idArrays = todoList.map(obj => obj.id)
        if (idArrays.includes(ranNum)) {
            return this.getRanNum(todoTask)
        }
        return ranNum;
    },//for add1

    checkTag(newTask) {
        if (newTask.tag === undefined) {
            newTask.tag = 'nothing'
        }
        return newTask
    },//for add2

    remove(objToRemove) {

    },

    update(objToUpdate) {

    },

    undo() {

    },
    
    redo() {

    },

    show(status) {

    },

    showTag() {

    },

    showTags() {

    },

    showAll() {

    },
};

const history = {
    historylist: [],
    undo() {

    },

    redo() {

    },
}

const show = {
    showingList: [],
    showStatusNum() {

    },

    showChanges(todoMethod, changed, beforeChange) {

    },

    status() {

    },

    tag() {

    },

    tags() {

    },

    all() {

    },
}

const checkError = {
    checkList: [],

}