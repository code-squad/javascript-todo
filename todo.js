//스켈레톤 코드로 한번 짜보자v
//this.statusNum = {}구현하기v
//showall()메서드 재귀호출로 구현하기v
//메서드마다 쓰는 메서드를 따로 객체로 나누자. OOO

//error를 구현해보자.
//아니면 step3에서 구현하는 에러메세지만 모아두는 객체를 만들까? XXX
//undo redo기능은 어떻게 구현할까?
//기능완성도를 위해서 동료에게 테스트 부탁하기
const todo = {
    task: [],

    add(objToAdd) {
        const notAddedLength = this.task.length
        const newTodo = {
            id: addFunc.getRanNum(this.task),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag,
            timeData: 0,
        }
        this.task.push(newTodo)
        const addedLength = this.task.length
        commonFunc.getStatusNum(this.task)
        commonFunc.printChangeThing(newTodo,addedLength, notAddedLength)
        commonFunc.printStatusNum()
    },//해야할일과 id값을 추가해주는 함수
    
    update(objToUpdate) {
        let beforeTaskStatus = []
        let changedTask = []
        this.task = updateFunc.checkUpdateStatus(objToUpdate, this.task);
        this.task = this.task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                beforeTaskStatus.push(taskObj.status)
                taskObj.status = objToUpdate.nextstatus.toLowerCase();
                changedTask.push(taskObj)
                return taskObj
            }
            return taskObj
        })
        commonFunc.getStatusNum(this.task)
        commonFunc.printChangeThing(changedTask[0], this.task.length, this.task.length, beforeTaskStatus[0])
        commonFunc.printStatusNum()
    },//상태 업데이트 함수
    

    remove(objToRemove) {
        const notRemovedLength = this.task.length
        let filteredTask = this.task.filter(taskObj => taskObj.id === objToRemove.id)
        let removedTask = this.task.filter(taskObj => taskObj.id !== objToRemove.id)
        this.task = removedTask
        const removedLength = this.task.length
        commonFunc.printChangeThing(filteredTask[0], removedLength, notRemovedLength)
    },//할 일과 id값을 제거해주는 함수
    
    show(status) {
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
        const todoNum = showTagFunc.getSameTagAndStatusNum(tag, 'todo', this.task)
        console.log(`[todo, 총 ${todoNum}개]`)
        showTagFunc.printByTag(tag, 'todo', this.task);
        const doingNum = showTagFunc.getSameTagAndStatusNum(tag, 'doing', this.task)
        console.log(`[doing, 총 ${doingNum}개]`)
        showTagFunc.printByTag(tag, 'doing', this.task);
        const doneNum = showTagFunc.getSameTagAndStatusNum(tag, 'done', this.task)
        console.log(`[done, 총 ${doneNum}개]`)
        showTagFunc.printByTag(tag, 'done', this.task);
    },//수정필요,//함수는 한가지의 일만 하도록

    showTags() {
        const taggedTask = this.task.filter(obj => {
            return obj.tag !== undefined
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
            this.showAll('todo')
            return;
        }
        console.log(`지금부터 2초뒤에 ${status}내역을 출력합니다.`)
        if(status === 'done') {
            setTimeout(function() {
                this.show('done')
            }.bind(todo), 2000)
            return;
        }
        setTimeout(function () {
            this.show(status)
            if(status === 'todo') {
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
};//add메서드 내에 들어가는 메서드들을 따로 모아서 처리하는 객체.


const updateFunc = {
    checkUpdateStatus(objToUpdate, todoTask) {
        if(objToUpdate.nextstatus === 'doing') {
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
            console.log(`ID: ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeTaskStatus} => ${objToPrint.status} 상태로 업데이트 되었습니다.`)
        }
    },//할일이 추가되거나 제거되거나 업데이트 될 때 적합한 내용을 출력해 주는 함수
};//todo의 메서드들이 중복적으로 사용하는 메서드들을 따로 모아서 처리


const checkError = {
    initedTask: [],//todo.task값을 항상 최신화해서 가져온 값
    
    add(initedTask) {
        
    },
    
    update(initedTask) {

    },
    
    remove(initedTask) {

    },
    //메서드마다 에러를 출력하는것을 결정.
};     

// 테스트

todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: 'C++', tag: 'programming' });
todo.add({ name: '회식', tag: '회사' });
todo.add({ name: '노래연습', tag: '자기개발' });
todo.add({ name: '과장님업무', tag: '회사' })
// 쓰는 기능

todo.showAll();




