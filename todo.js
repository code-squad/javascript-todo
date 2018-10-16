const todoData = {
    task: [],
    
    lastDoArrays: [],//이전에 했던 상태 3개 저장
    
    redo() {

    },

    undo() {
        this.task = undoUtility.undo(this.task, this.lastDoArrays.pop())
    },
    
    add(objToAdd) {
        if (!errorCheck.add(objToAdd, this.task)) return;
        this.task = addUtility.add(this.task, objToAdd)
        this.lastDoArrays = lastDoData.lastDoDataArrays
    },//해야할일과 id값을 추가해주는 함수
    
    remove(objToRemove) {
        if (!errorCheck.remove(objToRemove, this.task)) return;
        this.task = removeUtility.remove(this.task, objToRemove)
        this.lastDoArrays = lastDoData.lastDoDataArrays
    },//할 일과 id값을 제거해주는 함수
    
    update(objToUpdate) {
        if (!errorCheck.update(objToUpdate, this.task)) return;
        this.task = updateUtility.update(this.task, objToUpdate)
        this.lastDoArrays = lastDoData.lastDoDataArrays
    },//상태 업데이트 함수
    
    show(status) {
        if (!errorCheck.show(status)) return;
        showUtility.show(this.task, status)
    },//인자로 입력받은 상태의 정보들을 출력해주는 함수
    
    showTag(tag) {
        showTagUtility.showTag(this.task, tag)
    },//입력받은 태그의 정보들을 출력해주는 기능
    
    showTags() {
        showTagsUtility.showTags(this.task)
    },//태그에 따라 모든 값을 출력해주는 기능
    
    showAll() {
        showUtility.showAll(this.task)
    },//입력된 정보들의 상태에 따라 시간차로 출력해주는 기능
}//해야 할일의 데이터 객체


const redoUtility = {
    
};


const undoUtility = {
    undo(todoTask, lastDo) {

    }
};


const addUtility = {
    add(todoTask, objToAdd) {
        const newTodo = {
            id: this.getRanNum(todoTask),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag,
            timeData: 0,
        }
        todoTask.push(this.checkTag(newTodo))
        commonUtility.printChangeThing(newTodo, 'add')
        commonUtility.printStatusNum(todoTask)
        lastDoData.getStatusData(newTodo.id, 'add')
        return todoTask
    },

    getRanNum(todoTask) {
        const ranNum = Math.floor(Math.random() * 5)
        const idArrays = todoTask.map(obj => obj.id)
        if (idArrays.includes(ranNum)) {
            return this.getRanNum(todoTask)
        }
        return ranNum;
    },//중복되지 않는 랜덤한 숫자를뽑아내는 함수

    checkTag(newTask) {
        if (newTask.tag === undefined) {
            newTask.tag = 'nothing'
        }
        return newTask
    },
};//add메서드 내에 들어가는 메서드들을 따로 모아서 처리하는 객체.


const removeUtility = {
    remove(todoTask, objToRemove) {
        commonUtility.printChangeThing(this.getFilteredTask(todoTask, objToRemove)[0], 'remove')
        todoTask = this.getRemovedTask(todoTask, objToRemove)
        lastDoData.getRemove(objToRemove.id, 'remove')
        return todoTask
    },

    getRemovedTask(todoTask, objToRemove) {
        return todoTask.filter(taskObj => {
            return taskObj.id !== objToRemove.id
        })
    },

    getFilteredTask(todoTask, objToRemove) {
        return todoTask.filter(taskObj => {
            return taskObj.id === objToRemove.id
        })
    },
}//remove메서드 내에 들어가는 메서드들을 따로 모아서 처리하는 객체


const updateUtility = {
    update(todoTask, objToUpdate) {
        let beforeTaskStatus = [];
        let changedTask = [];
        todoTask = todoTask.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                beforeTaskStatus.push(taskObj.status)
                taskObj.status = objToUpdate.nextstatus.toLowerCase().replace(/ /gi, "")
                changedTask.push(taskObj)
                return taskObj
            }
            return taskObj
        })
        todoTask = this.checkUpdateStatus(objToUpdate, todoTask)
        commonUtility.printStatusNum(todoTask)
        commonUtility.printChangeThing(changedTask[0], 'update', beforeTaskStatus[0])
        lastDoData.getUpdate(objToUpdate.id, 'update')
        return todoTask
    },

    checkUpdateStatus(objToUpdate, todoTask) {
        if (objToUpdate.nextstatus === 'doing') {
            return this.updateDoingTime(objToUpdate, todoTask)
        } else if (objToUpdate.nextstatus === 'done') {
            return this.updateTakeTime(objToUpdate, todoTask)
        }
        return todoTask
    },

    updateDoingTime(objToUpdate, todoTask) {
        todoTask.forEach(taskObj => {
            if (taskObj.id === objToUpdate.id) {
                taskObj.timeData = Date.now();
            }
        })
        return todoTask
    },//업데이트할 객체를 인자로 받아 task내의 timeData값을 변경.

    updateTakeTime(objToUpdate, todoTask) {
        todoTask.forEach(taskObj => {
            if (taskObj.id === objToUpdate.id) {
                taskObj.timeData = this.getTakeTime(taskObj.timeData, Date.now())
            }
        })
        return todoTask
    },//업데이트할 객체를 인자로 받아 task내의 timeData의 값을 걸린 시간으로 변경.

    getTakeTime(doingTime, currentTime) {
        let takenTime = ''
        if (doingTime === 0) {
            takenTime += '걸린시간 없음'
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
    },//걸린 시간을 계산해주는 함수
}//update메서드 내에 들어가는 메서드 들을 따로 모아서 처리


const showTagUtility = {
    showTag(todoTask, tag) {
        if (tag !== undefined) {
            console.log(`--태그가 [${tag}]인 할 일들--`)
            this.printResult(tag, todoTask)
            return;
        }
        console.log(`--태그가 없는 할 일들--`)
        this.printResult('nothing', todoTask)
    },

    printResult(tag, todoTask) {
        const todoNum = this.getSameTagAndStatusNum(tag, 'todo', todoTask)
        console.log(`[todo, 총 ${todoNum}개]`)
        this.printByTag(tag, 'todo', todoTask);
        const doingNum = this.getSameTagAndStatusNum(tag, 'doing', todoTask)
        console.log(`[doing, 총 ${doingNum}개]`)
        this.printByTag(tag, 'doing', todoTask);
        const doneNum = this.getSameTagAndStatusNum(tag, 'done', todoTask)
        console.log(`[done, 총 ${doneNum}개]`)
        this.printByTag(tag, 'done', todoTask);
        return;
    },

    printByTag(tag, status, todoTask) {
        const filteredTask = todoTask.filter(taskObj => taskObj.tag === tag && taskObj.status === status)
        filteredTask.forEach(filteredObj => {
            if(status === 'done') {
                console.log(`ID : ${filteredObj.id}, ${filteredObj.name}, ${filteredObj.timeData}`)
                return;
            }
            console.log(`ID : ${filteredObj.id}, ${filteredObj.name}`)
        })
    },

    getSameTagAndStatusNum(tag, status, todoTask) {
        let sameTagAndStatusNum = 0
        todoTask.forEach(taskObj => {
            if (taskObj.tag === tag && taskObj.status === status) {
                sameTagAndStatusNum++
            }
        })
        return sameTagAndStatusNum
    },//태그와 상태가 같은 것들의 개수를 세어주는 함수

}//showTagfunc메서드 내에 들어가는 메서드들을 따로 모아서 처리


const showTagsUtility = {
    showTags(todoTask) {
        const taggedTask = todoTask.filter(taskObj => {
            return taskObj.tag !== 'nothing'
        })
        const sameTagArrays = this.getTagArrays(taggedTask);
        sameTagArrays.forEach(tag => {
            const sameTagNum = this.getSameTagNum(tag, taggedTask)
            this.printSameTag(tag, taggedTask, sameTagNum)
        })
    },

    getTagArrays(taggedTask) {
        const sameTagArrays = [];
        taggedTask.forEach(taggedTaskObj => {
            if (!sameTagArrays.includes(taggedTaskObj.tag)) {
                sameTagArrays.push(taggedTaskObj.tag)
            }
        })
        return sameTagArrays
    },//현재 task배열 내에있는 모든 tag값들을 중복 없이 따로 모아놓는 배열을 만드는 함수

    printSameTag(tag, taggedTask, sameTagNum) {
        console.log(`--[${tag}], 총 ${sameTagNum}개--`)
        taggedTask.forEach(taggedTaskObj => {
            if (tag === taggedTaskObj.tag) {
                console.log(`ID : ${taggedTaskObj.id}, ${taggedTaskObj.name}, [${taggedTaskObj.status}]`)
            }
        })
    },//tag의 값에 따라서 출력해주는 함수

    getSameTagNum(tag, taggedTask) {
        sameTagNum = 0
        taggedTask.forEach(taggedTaskObj => {
            if (tag === taggedTaskObj.tag) {
                sameTagNum++
            }
        })
        return sameTagNum
    },//같은 태그의 개수를 세어주는 함수
}//showTagsfunc메서드 내에 들어가는 메서드들을 따로 모아서 처리


const showUtility = {
    show(todoTask, status) {
        console.log(`--${status} 상태인 할 일들--`);
        todoTask.forEach(taskObj => {
            if (status === 'done' && taskObj.status === 'done') {
                console.log(`ID : ${taskObj.id}, ${taskObj.name}, [${taskObj.tag}], ${taskObj.timeData}`)
            } else if (taskObj.status === status) {
                console.log(`ID : ${taskObj.id}, ${taskObj.name}, [${taskObj.tag}]`)
            }
        })
    },//인자로 입력받은 상태의 정보들을 출력해주는 함수

    showAll(todoTask) {
        commonUtility.getStatusNum(todoTask);
        console.log(`총 ${todoTask.length}개의 리스트를 가져왔습니다.`)
        this.setTime(todoTask, 'todo')
    },

    setTime(todoTask, status) {
        setTimeout(function () {
            this.show(todoTask, status)
            if (status === 'todo') {
                status = 'doing'
                this.setTime(todoTask, status)
            } else if (status === 'doing') {
                status = 'done'
                this.setTime(todoTask, status)
            } else if (status === 'done') {
                return;
            }
        }.bind(showUtility), 2000)
    },
};

const commonUtility = {
    statusNum: {
        todo: 0,
        doing: 0,
        done: 0
    },//statusNum객체

    initStatusNum() {
        this.statusNum.todo = 0;
        this.statusNum.doing = 0;
        this.statusNum.done = 0;
    },//statusNum 객체를 초기화 시켜주는 함수

    getStatusNum(accumulatedTask) {
        this.initStatusNum();
        accumulatedTask.forEach(obj => {
            this.statusNum[obj.status]++
        })
    },//todo, doing, done 의갯수를 세어주는 함수

    printStatusNum(accumulatedTask) {
        this.getStatusNum(accumulatedTask)
        console.log(`현재상태 todo : ${this.statusNum.todo}, doing: ${this.statusNum.doing}, done : ${this.statusNum.done}`)
    },//상태를 출력해주는 함수

    printChangeThing(objToPrint, calledMethod, beforeTaskStatus) {
        if (calledMethod === 'add') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 추가되었습니다.`);
        } else if (calledMethod === 'remove') {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 삭제 완료`)
        } else {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeTaskStatus} => ${objToPrint.status} 상태로 업데이트 되었습니다.`)
        }
    },//할일이 추가되거나 제거되거나 업데이트 될 때 적합한 내용을 출력해 주는 함수

};//Utility에서 공통적으로 사용되는 메서드들의 모음

const errorCheck = {
    add(objToAdd, todoTask) {
        if((todoTask.filter(taskObj => taskObj.name === objToAdd.name)).length !== 0){
            console.log(`[error] 할 일 리스트에 같은 이름의 할 일이 존재합니다.`)
            return false
        };
        return true
    },

    remove(objToRemove, todoTask) {
        if (!todoTask.map(taskObj => taskObj.id).includes(objToRemove.id)) {
            console.log(`[error] 입력하신 id는 존재하지 않습니다. (입력하신 id : ${objToRemove.id})`);
            return false
        }
        return true
    },

    update(objToUpdate, todoTask) {
        const compareTask = todoTask.filter(taskObj => objToUpdate.id === taskObj.id)
        if (!todoTask.map(taskObj => taskObj.id).includes(objToUpdate.id)) {
            console.log(`[error] 입력하신 id는 존재하지 않습니다. (입력하신 id : ${objToUpdate.id})`);
            return false
        }
        if (compareTask[0].status === objToUpdate.nextstatus) {
            console.log(`[error] 이미 ${objToUpdate.nextstatus}인 상태입니다.`)
            return false
        } else if (compareTask[0].status === 'done' && objToUpdate.nextstatus === 'doing') {
            console.log(`[error] ${compareTask[0].status}상태에서 ${objToUpdate.nextstatus}상태로 되돌아갈 수 없습니다.`)
            return false
        }
        return true
    },

    show(status) {
        if (status !== 'doing' && status !== 'done' && status !== 'todo') {
            console.log(`[error] 할 일 들의 상태는 todo나 doing이나 done이어야만 합니다.
모든 일들을 보고싶다면 todo.showAll()을 입력해 주세요.`);
            return false
        }
        return true
    },
}//문제상황이 발생했을 때 에러를 반환하는 메서드들의 모음

const lastDoData = {
    lastDoDataArrays:[],
    getStatusData(idValue, status) {
        this.lastDoDataArrays.push({id:idValue, status:status})
        this.lastDoDataArrays = this.checkArraysLength(this.lastDoDataArrays)
    },

    checkArraysLength(array) {
        if(array.length > 3) {
            array.shift()
        }
        return array
    }
}
// 테스트




todoData.add({ name: 'c++', tag: 'programming' });
todoData.add({ name: 'c++', tag: 'programming' })
todoData.add({ name: 'javascript', tag: 'programming' })
todoData.add({ name: 'java' })
todoData.remove({ id: 0 })


todoData.update({ id: 15, nextstatus: 'doing' })
todoData.update({ id: 3, nextstatus: 'doing' })
todoData.update({ id: 3, nextstatus: 'done' })
todoData.remove({ id: 15 });
todoData.show('done')
todoData.show('nothing')
todoData.showTag('awfe');
todoData.showTag();
todoData.show('doing');
todoData.show('nothingei')
todoData.show('todo')







