
// 다양한 출력을 지원한다. (모든태그, 특정태그, 모든리스트, 특정상태리스트)
// 만들어야 할 함수 todo.showTag, todo.show(status), todo.showAll()

// doing 에서 done으로 갈때는 소요시간이 출력되도록 doing상태부터 '시간정보' 가 있어야 한다.
// ex) > todo.show("done");  //done항목을 노출할때는,  doing-> done까지 소요된 시간이 출력된다.
// - 20번, 휴대폰수리, [other], 1시간1분
// - 21번, closure공부, [programming], 1일 23분

// showAll메서드는 모든리스트를 출력하며, 2초-> 3초 ->2초로 출력된다. (총7초 소요)
// 개발과정에서 본인이 판단해서, 별도의 객체를 분리해야 할 것이면 그렇게 시도한다.
const saveTimeObj = {
    doingChangedTimeArrays: [],
    doneChangedTimeArrays: [],
    takenTimeArrays: [],
    getTakeTime: function(doingTime, doneTime) {
        let takenMsecTime = doneTime - doingTime
        const msecPerMinute = 1000 * 60, msecPerHour = msecPerMinute * 60, msecPerDay = msecPerHour * 24
        const takenDays = Math.floor(takenMsecTime / msecPerDay)
        takenMsecTime = takenMsecTime - takenDays * msecPerDay
        const takenHours = Math.floor(takenMsecTime / msecPerHour)
        takenMsecTime = takenMsecTime - takenHours * msecPerHour
        const takenMinutes = Math.floor(takenMsecTime / msecPerMinute)
        takenMsecTime = takenMsecTime - takenMinutes * msecPerMinute
        console.log(`${takenDays}일 ${takenHours}시간 ${takenMinutes}분이 걸렸습니다.`)
    }
}//각각 의 시간 정보들을 저장해주는 obj

const todo = {
    task: [],

    getRanNum: function () {
        const ranNum = Math.floor(Math.random() * 5)
        const idArrays = this.task.map(obj => obj.id)
        if(idArrays.includes(ranNum)) {
            return this.getRanNum()
        }
        return ranNum;
    },//중복되지 않는 랜덤한 숫자를뽑아내는 함수

    getStatusNum: function (accumulatedTask) {
        const statusNum = {
            todo: 0,
            doing: 0,
            done: 0
        }
        accumulatedTask.forEach(obj => {
            statusNum[obj.status]++
        })
        return statusNum
    },//상태를 초기화 시켜주는 함수

    printStatusNum: function (statusNum) {
        console.log(`현재상태 todo : ${statusNum.todo}, doing: ${statusNum.doing}, done : ${statusNum.done}`)
    },//상태를 출력해주는 함수

    printChangeThing: function (objToPrint, beforeTaskLength, beforeTaskStatus) {
        if(this.task.length > beforeTaskLength) {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 항목이 추가되었습니다.`);
        } else if(this.task.length < beforeTaskLength) {
            console.log(`ID : ${objToPrint.id}, ${objToPrint.name} 삭제 완료`)
        } else {
            console.log(`ID: ${objToPrint.id}, ${objToPrint.name} 항목이 ${beforeTaskStatus} => ${objToPrint.status} 상태로 업데이트 되었습니다.`)
        }
    },//할일이 추가되거나 제거되거나 업데이트 될 때 적합한 내용을 출력해 주는 함수

    add: function (objToAdd) {
        const notAddedLength = this.task.length
        const newTodo = {
            id: this.getRanNum(),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag,
            takeTime: 0,
        }
        let statusNum = this.getStatusNum(this.task)
        this.task.push(newTodo)
        this.printChangeThing(newTodo, notAddedLength)
        this.printStatusNum(statusNum)
    },//해야할일과 id값을 추가해주는 함수

    update: function (objToUpdate) {
        let beforeTaskStatus = []
        todo.updateTime(objToUpdate)
        this.task = this.task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                beforeTaskStatus.push(taskObj.status)
                taskObj.status = objToUpdate.nextstatus.toLowerCase();
                return taskObj
            }
            return taskObj
        })
        const changedTask = this.task.filter(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                return taskObj
            }
        })
        let statusNum = this.getStatusNum(this.task)
        this.printChangeThing(changedTask[0], this.task.length, beforeTaskStatus[0])
        this.printStatusNum(statusNum)
    },//상태 업데이트 함수//주어진 정보의 시간을 넣을 수 있도록 수정 요망

    updateTime: function(objToUpdate) {
        if(objToUpdate.nextstatus === 'doing') {
            const doingTimeData = {
                id: objToUpdate.id,
                time: Date.now(),
            }
            saveTimeObj.doingChangedTimeArrays.push(doingTimeData)
        } else if (objToUpdate.nextstatus === 'done') {
            const doneTimeData = {
                id: objToUpdate.id,
                time: Date.now(),
            }
            saveTimeObj.doneChangedTimeArrays.push(doneTimeData)
        }
    },//업데이트할 객체를 인자로 받아 id값과 업데이트될때의 시간 값을 saveTimeObj에 저장.
    
    

    remove: function (objToRemove) {
        const notRemovedLength = todo.task.length
        let filteredTask = this.task.filter(taskObj => taskObj.id === objToRemove.id)
        let removedTask = this.task.filter(taskObj => taskObj.id !== objToRemove.id)
        this.task = removedTask
        this.printChangeThing(filteredTask[0], notRemovedLength)
    },//할 일과 id값을 제거해주는 함수

    showAll: function () {
        console.log(`입력된 할 일들`)
        this.task.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}, 태그 : ${obj.tag}`)
        })
    },//입력된 정보들의 상태에 따라 시간차로 출력해주는 함수(수정필요)

    show: function (status) {

    },//인자로 입력받은 상태의 정보들을 출력해주는 함수

    showTag: function (tag) {
        console.log(`현재 ${tag} 태그를 가진 할 일들은 다음과 같습니다.`);
        const tagSeparatedTask = this.task.filter(obj => {
            return obj.tag === tag
        })
        tagSeparatedTask.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}`)
        })
    },//수정필요, 여기에 showTags기능까지 넣어볼 것.
}//해야 할일 객체
//map filter중복적으로 사용하지 말아보기.
// 테스트

todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: 'C++', tag: 'programming' });
todo.add({ name: '회식', tag: '회사' });
todo.add({ name: '노래연습', tag: '자기개발' });
todo.add({ name: '과장님업무', tag: '회사' })

