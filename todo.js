//undo redo기능구현
//메서드를 사용할때마다 그 이전의 todo.task값을 저장하면 어떨까?
//메서드를 부르기 전의 todo.task값을 저장해놓고, undo를 부르면 그값을 
//배출, 데이터를 3개이상 저장하지 못하게 만들기도 해야겠지.
//1. 이전의 todo.task배열을 저장해주는 공간이 필요함.
//2. 우선 내가 정한 기준은 '메서드 마다 객체로' 이다. 잊지말것.
//3. undo는 redo를 불렀을때만 사용할 수 있도록 하자.
//4. undo와 redo의 밀접한 관계를 위해서 undo만을 위한 새로운 배열이 필요
//5. 혼자서라도 내 코드를 괴롭혀 보기. 
const redoFunc = {

}


const undoFunc = {
    saveRemovedDataArrays: [],
    saveUpdatedDataArrays: [],
    add(todoTask) {
        const addedData = todoTask.pop()
        console.log(`ID : ${addedData.id}, ${addedData.name}이(가) 다시 삭제되었습니다.`)
        return todoTask
    },

    remove(todoTask) {
        const removedData = this.saveRemovedDataArrays.pop()
        todoTask.push(removedData)
        console.log(`ID : ${removedData.id}, ${removedData.name}이(가) 다시 추가되었습니다.`)
        return todoTask
    },

    update(todoTask) {
        const updatedData = this.saveUpdatedDataArrays.pop()
        todoTask.forEach(taskObj => {
            if (taskObj.id === updatedData.id) {
                console.log(`ID : ${taskObj.id}항목이 ${taskObj.status} => ${updatedData.status}로 변경되었습니다.`)
                taskObj.status = updatedData.status
                taskObj.timeData = updatedData.timeData
            }
        })
        console.log(todoTask)
        return todoTask
    }
}


const todo = {
    task: [],
    lastDoArrays: [],

    redo() {

    },

    undo() {
        while(this.lastDoArrays.length > 3) {
            this.lastDoArrays.shift()
        }
        const lastFunction = this.lastDoArrays.pop()
        if (lastFunction === 'add') {
            this.task = undoFunc.add(this.task)
        } else if (lastFunction === 'remove') {
            this.task = undoFunc.remove(this.task)
        } else if (lastFunction === 'update') {
            this.task = undoFunc.update(this.task)
        } else {
            console.log(`되돌일 일이 없거나 3번이상 undo를 사용하셨습니다.`)
        }
    },
    //기능마다 함수로 나눌것,
    //배열들을 어디에 저장할 지 한번 더 생각 해 볼것.

    add(objToAdd) {
        if (!addFunc.checkError(objToAdd, this.task)) {
            return
        }
        const notAddedLength = this.task.length
        const newTodo = {
            id: addFunc.getRanNum(this.task),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag,
            timeData: 0,
        }
        this.task.push(newTodo)
        this.task = addFunc.initTag(this.task)
        const addedLength = this.task.length
        commonFunc.getStatusNum(this.task)
        commonFunc.printChangeThing(newTodo, addedLength, notAddedLength)
        commonFunc.printStatusNum()
        this.lastDoArrays.push('add')
    },//해야할일과 id값을 추가해주는 함수

    update(objToUpdate) {
        this.task.forEach(taskObj => {
            if (taskObj.id === objToUpdate.id) {
                const beforeTask = {
                    id: taskObj.id,
                    name: taskObj.name,
                    status: taskObj.status,
                    tag: taskObj.tag,
                    timeData: taskObj.timeData
                }
                undoFunc.saveUpdatedDataArrays.push(beforeTask)
            }
        })
        if (!updateFunc.checkError(objToUpdate, this.task)) {
            return;
        }
        let beforeTaskStatus = []
        let changedTask = []
        this.task = this.task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                beforeTaskStatus.push(taskObj.status)
                taskObj.status = objToUpdate.nextstatus.toLowerCase();
                changedTask.push(taskObj)
                return taskObj
            }
            return taskObj
        })
        this.task = updateFunc.checkUpdateStatus(objToUpdate, this.task);
        commonFunc.getStatusNum(this.task)
        commonFunc.printChangeThing(changedTask[0], this.task.length, this.task.length, beforeTaskStatus[0])
        commonFunc.printStatusNum()
        this.lastDoArrays.push('update')
    },//상태 업데이트 함수

    remove(objToRemove) {
        if (!removeFunc.checkError(objToRemove, this.task)) {
            return;
        }
        const notRemovedLength = this.task.length
        let filteredTask = this.task.filter(taskObj => taskObj.id === objToRemove.id)
        let removedTask = this.task.filter(taskObj => taskObj.id !== objToRemove.id)
        this.task = removedTask
        const removedLength = this.task.length
        commonFunc.printChangeThing(filteredTask[0], removedLength, notRemovedLength)
        this.lastDoArrays.push('remove')
        undoFunc.saveRemovedDataArrays.push(filteredTask[0])
    },//할 일과 id값을 제거해주는 함수

    show(status) {
        if (!showFunc.checkError(status)) {
            return;
        }
        console.log(`[${status} 상태인 할 일들]`)
        this.task.forEach(taskObj => {
            if (status === 'done' && taskObj.status === 'done') {
                console.log(`ID : ${taskObj.id}, ${taskObj.name}, [${taskObj.tag}], ${taskObj.timeData}`)
            } else if (taskObj.status === status) {
                console.log(`ID : ${taskObj.id}, ${taskObj.name}, [${taskObj.tag}]`)
            }
        })
    },//인자로 입력받은 상태의 정보들을 출력해주는 함수

    showTag(tag) {
        if (tag !== undefined) {
            console.log(`태그가 ${tag}인 할 일들`)
            showTagFunc.printResult(tag, this.task)
            return;
        }
        console.log(`태그가 없는 할 일들`)
        showTagFunc.printResult('nothing', this.task)
    },//수정필요,//함수는 한가지의 일만 하도록

    showTags() {
        const taggedTask = this.task.filter(obj => {
            return obj.tag !== 'nothing'
        })
        const sameTagArrays = showTagsFunc.getTagArrays(taggedTask);
        sameTagArrays.forEach(tag => {
            const sameTagNum = showTagsFunc.getSameTagNum(tag, taggedTask)
            showTagsFunc.printSameTag(tag, taggedTask, sameTagNum)
        })
    },//태그에 따라 모든 값을 출력해주는 함수

    showAll(status) {
        if (!arguments[0]) {
            commonFunc.getStatusNum(this.task);
            console.log(`총 ${this.task.length}개의 리스트를 가져왔습니다.`);
            return this.showAll('todo')
        }
        console.log(`지금부터 2초뒤에 ${status}내역을 출력합니다.`)
        if (status === 'done') {
            setTimeout(function () {
                this.show('done')
            }.bind(todo), 2000)
            return;
        }
        setTimeout(function () {
            this.show(status)
            if (status === 'todo') {
                status = 'doing'
                this.showAll(status)
            } else if (status === 'doing') {
                status = 'done'
                this.showAll(status)
            }
        }.bind(todo), 2000)
    },//입력된 정보들의 상태에 따라 시간차로 출력해주는 함수, 재귀적으로 표현해볼것.
}//해야 할일 객체


const addFunc = {
    getRanNum(todoTask) {
        const ranNum = Math.floor(Math.random() * 5)
        const idArrays = todoTask.map(obj => obj.id)
        if (idArrays.includes(ranNum)) {
            return this.getRanNum(todoTask)
        }
        return ranNum;
    },//중복되지 않는 랜덤한 숫자를뽑아내는 함수

    checkError(objToAdd, todoTask) {
        let checkFalse = 0
        todoTask.forEach(taskObj => {
            if (taskObj.name === objToAdd.name) {
                console.log(`[error] 이미 할 일 리스트에 같은 이름의 할 일이 존재합니다.`)
                checkFalse++
            }
        })
        return (checkFalse === 0)
    },

    initTag(todoTask) {
        todoTask.forEach(taskObj => {
            if (taskObj.tag === undefined) {
                taskObj.tag = 'nothing'
            }
        })
        return todoTask
    }
};//add메서드 내에 들어가는 메서드들을 따로 모아서 처리하는 객체.


const removeFunc = {
    checkError(objToRemove, todoTask) {
        let checkFalse = 0
        todoTask.forEach(taskObj => {
            if (taskObj.id === objToRemove.id) {
                checkFalse++
            }
        })
        if (checkFalse !== 1) {
            console.log(`[error] 존재하지 않는 id입니다. (입력하신 id : ${objToRemove.id})`)
            return false
        }
        return true
    },
}


const updateFunc = {
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

    checkError(objToUpdate, todoTask) {
        let checkFalse = 0
        todoTask.forEach(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                if (objToUpdate.nextstatus === taskObj.status) {
                    console.log(`[error] 이미 ${objToUpdate.nextstatus}인 상태입니다.`)
                    checkFalse++
                    return;
                } else if (objToUpdate.nextstatus === 'doing' && taskObj.status === 'done') {
                    console.log(`[error] ${taskObj.status}상태에서 ${objToUpdate.nextstatus}상태로 갈 수는 없습니다.`);
                    checkFalse++
                    return;
                }
            }
        })
        return (checkFalse === 0)
    },
}//update메서드 내에 들어가는 메서드 들을 따로 모아서 처리


const showTagFunc = {
    printByTag(tag, status, todoTask) {
        todoTask.forEach(taskObj => {
            if (taskObj.tag === tag && taskObj.status === status) {
                if (status === 'done') {
                    console.log(`ID : ${taskObj.id}, ${taskObj.name}, ${taskObj.timeData}`)
                    return;
                }
                console.log(`ID : ${taskObj.id}, ${taskObj.name}`)
            }
        })
    },//tag의 값과 상태의 값을 인자로 받아 출력해주는 함수

    getSameTagAndStatusNum(tag, status, todoTask) {
        let sameTagAndStatusNum = 0
        todoTask.forEach(taskObj => {
            if (taskObj.tag === tag && taskObj.status === status) {
                sameTagAndStatusNum++
            }
        })
        return sameTagAndStatusNum
    },//태그와 상태가 같은 것들의 개수를 세어주는 함수

    printResult(tag, todoTask) {
        const todoNum = this.getSameTagAndStatusNum(tag, 'todo', todoTask)
        console.log(`[todo, 총 ${todoNum}개]`)
        this.printByTag(tag, 'todo', todoTask);
        const doingNum = this.getSameTagAndStatusNum(tag, 'doing', todoTask)
        console.log(`[doing, 총 ${doingNum}개]`)
        this.printByTag(tag, 'doing', todoTask);
        const doneNum = this.getSameTagAndStatusNum(tag, 'done', todoTask)
        console.log(`[done, 총 ${doneNum}개]`)
        showTagFunc.printByTag(tag, 'done', todoTask);
        return;
    }
}//showTagfunc메서드 내에 들어가는 메서드들을 따로 모아서 처리


const showTagsFunc = {
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
        console.log(`${tag}, 총 ${sameTagNum}개`)
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


const showFunc = {
    checkError(status) {
        if (status !== 'doing' && status !== 'done' && status !== 'todo') {
            console.log(`[error] 할 일들의 상태는 todo나 doing이나 done이어야만 합니다.`)
            return false
        }
        return true
    }
}


const commonFunc = {
    statusNum: {
        todo: 0,
        doing: 0,
        done: 0
    },

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
    },//

    printStatusNum() {
        console.log(`현재상태 todo : ${this.statusNum.todo}, doing: ${this.statusNum.doing}, done : ${this.statusNum.done}`)
    },//상태를 출력해주는 함수

    printChangeThing(objToPrint, currentTaskLength, beforeTaskLength, beforeTaskStatus) {
        if (currentTaskLength > beforeTaskLength) {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 추가되었습니다.`);
        } else if (currentTaskLength < beforeTaskLength) {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 삭제 완료`)
        } else {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeTaskStatus} => ${objToPrint.status} 상태로 업데이트 되었습니다.`)
        }
    },//할일이 추가되거나 제거되거나 업데이트 될 때 적합한 내용을 출력해 주는 함수
};//todo의 메서드들이 중복적으로 사용하는 메서드들을 따로 모아서 처리


// 테스트




todo.add({ name: 'c++', tag: 'programming' });
todo.add({ name: 'test11', tag: 'test' });
todo.add({ name: 'test11', tag: 'test' });
todo.add({ name: 'test3' });
todo.add({ name: 'test4', tag: 'test4' });
todo.add({ name: 'test5', tag: 'test5' });
todo.remove({id:3})
todo.undo()
todo.undo()
todo.undo()
console.log(todo.task)
// todo.update({ id: 3, nextstatus: 'doing' })
// todo.update({ id: 3, nextstatus: 'doing' })
// todo.update({ id: 3, nextstatus: 'done' })
// todo.remove({ id: 15 });
// todo.show('done')
// todo.show('nothing')
// todo.showTag('awfe');
// todo.showTag();
// todo.show('doing');
// todo.show('nothingei')
// todo.show('todo')
// todo.showAll();






