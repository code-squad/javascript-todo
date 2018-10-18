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
        show.changes('add', newTodo)
        show.nowStatus(this.statusNum)
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
        show.changes('remove', this.todoList.filter(listObj => listObj.id === objToRemove.id)[0])
        this.todoList = this.todoList.filter(taskObj => taskObj.id !== objToRemove.id)
    },//remove

    update(objToUpdate) {
        objToUpdate.nextstatus = objToUpdate.nextstatus.toLowerCase().replace(/ /gi, "")
        const beforeData = [];
        const updatedData = [];
        this.todoList = this.todoList.map(obj => {
            if(obj.id === objToUpdate.id) {
                beforeData.push({id: obj.id, name: obj.name, status: obj.status, tag: obj.tag, timeData: obj.timeData})
                obj.status = objToUpdate.nextstatus
                return obj
            }
            return obj
        })
        this.todoList = this.checkUpdateStatus(objToUpdate, this.todoList)
        this.todoList.forEach(obj => {
            if(obj.id === objToUpdate.id) {
                updatedData.push({id: obj.id, name: obj.name, status: obj.status, tag: obj.tag, timeData: obj.timeData})
            }
        })
        show.changes(updatedData[0], 'update', beforeData[0])
        show.nowStatus(this.statusNum)
    },//update

    checkUpdateStatus(objToUpdate, todoList) {
        if (objToUpdate.nextstatus === 'doing') {
            return this.updateDoingTime(objToUpdate, todoList)
        } else if (objToUpdate.nextstatus === 'done') {
            return this.updateTakeTime(objToUpdate, todoList)
        }
        return todoList
    },//for update1

    updateDoingTime(objToUpdate, todoList) {
        todoList.forEach(obj => {
            if (obj.id === objToUpdate.id) {
                obj.timeData = Date.now();
            }
        })
        return todoList
    },//for update2

    updateTakeTime(objToUpdate, todoList) {
        todoList.forEach(obj => {
            if (obj.id === objToUpdate.id) {
                obj.timeData = this.getTakeTime(obj.timeData, Date.now())
            }
        })
        return todoList
    },//for update3

    getTakeTime(doingTime, currentTime) {
        let takenTime = ''
        if (doingTime === 0) {
            takenTime += '한방에 끝'
            return takenTime
        }
        let takenMsecTime = currentTime - doingTime
        const msecPerMinute = 1000 * 60, msecPerHour = msecPerMinute * 60, msecPerDay = msecPerHour * 24
        const takenDays = Math.floor(takenMsecTime / msecPerDay)
        takenMsecTime = takenMsecTime - takenDays * msecPerDay
        const takenHours = Math.floor(takenMsecTime / msecPerHour)
        takenMsecTime = takenMsecTime - takenHours * msecPerHour
        const takenMinutes = Math.floor(takenMsecTime / msecPerMinute)
        takenMsecTime = takenMsecTime - takenMinutes * msecPerMinute
        takenTime += takenDays + '일, ' + takenHours + '시간, ' + takenMinutes + '분'
        return takenTime;
    },//for update4

    undo() {

    },
    
    redo() {

    },

    show(status) {
        show.status(this.todoList, status)
    },

    showTag(tag) {
        show.tag(this.todoList, tag)
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

    changes(method, objToPrint, beforeChangeObj) {
        if (method === 'add') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 추가되었습니다.`);
        } else if (method === 'remove') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 삭제 완료`)
        } else {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeChangeObj.status} => ${objToPrint.status} 상태로 변경 되었습니다.`)
        }
    },

    status(todoList, status) {
        console.log(`--${status} 상태인 할 일들--`);
        todoList.forEach(obj => {
            if (status === 'done' && obj.status === 'done') {
                console.log(`ID : ${obj.id}, ${obj.name}, [${obj.tag}], ${obj.timeData}`)
            } else if (obj.status === status) {
                console.log(`ID : ${obj.id}, ${obj.name}, [${obj.tag}]`)
            }
        })
    },//showStatus

    tag(todoList, tag) {
        if (tag !== undefined) {
            console.log(`--태그가 [${tag}]인 할 일들--`)
            this.byTag(tag, todoList)
            return;
        }
        console.log(`--태그가 없는 할 일들--`)
        this.byTag('nothing', todoList)
    },//showtag

    byTag(tag, todoList) {
        const todoNum = this.getSameTagAndStatusNum(tag, 'todo', todoList)
        console.log(`[todo, 총 ${todoNum}개]`)
        this.sameTag(tag, 'todo', todoList);
        const doingNum = this.getSameTagAndStatusNum(tag, 'doing', todoList)
        console.log(`[doing, 총 ${doingNum}개]`)
        this.sameTag(tag, 'doing', todoList);
        const doneNum = this.getSameTagAndStatusNum(tag, 'done', todoList)
        console.log(`[done, 총 ${doneNum}개]`)
        this.sameTag(tag, 'done', todoList);
    },//for tag

    sameTag(tag, status, todoList) {
        const filteredList = todoList.filter(obj => obj.tag === tag && obj.status === status)
        filteredList.forEach(obj => {
            if (status === 'done') {
                console.log(`ID : ${obj.id}, ${obj.name}, ${obj.timeData}`)
                return;
            }
            console.log(`ID : ${obj.id}, ${obj.name}`)
        })
    },//for tag

    getSameTagAndStatusNum(tag, status, todoTask) {
        let sameTagAndStatusNum = 0
        todoTask.forEach(taskObj => {
            if (taskObj.tag === tag && taskObj.status === status) {
                sameTagAndStatusNum++
            }
        })
        return sameTagAndStatusNum
    },//for tag

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
todo.show('todo')
todo.showTag('programming')
console.log(todo.todoList)