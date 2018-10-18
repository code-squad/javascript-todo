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
        this.todoList.push(this.checkTag(newTodo));
        this.getStatusNum(this.todoList)
        show.nowStatus(this.statusNum)
        show.changes('add', newTodo)
    },//add

    getRanNum(todoList) {
        const ranNum = Math.floor(Math.random() * 6)
        const idArrays = todoList.map(obj => obj.id)
        if (idArrays.includes(ranNum)) {
            return this.getRanNum(this.todoList)
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
        show.changes('remove', this.getFilteredTask(this.todoList, objToRemove)[0])
        this.todoList = this.todoList.filter(taskObj => {
            return taskObj.id !== objToRemove.id
        })
    },//remove

    getFilteredTask(todoTask, objToRemove) {
        return todoTask.filter(taskObj => {
            return taskObj.id === objToRemove.id
        })
    },//for remove2

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
    nowStatus(statusNum) {
        console.log(`현재상태 todo : ${statusNum.todo}, doing: ${statusNum.doing}, done : ${statusNum.done}`)
    },

    changes(method, objToPrint, beforeChange) {
        if (method === 'add') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 추가되었습니다.`);
        } else if (method === 'remove') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 삭제 완료`)
        } else {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeChange} => ${objToPrint.status} 상태로 변경 되었습니다.`)
        }
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

todo.add({name:'c++', tag:'programming'})
todo.add({name:'c++', tag:'programming'})
todo.add({name:'c++', tag:'programming'})
todo.add({name:'c++', tag:'programming'})
todo.add({name:'c++', tag:'programming'})
todo.add({name:'c++', tag:'programming'})
todo.remove({id:0})
console.log(todo.todoList)