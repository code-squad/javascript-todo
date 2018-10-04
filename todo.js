const todo = {
    //task의 아이디와idArrays의 sync가 정확하게 맞을까?
    task: [],
    idArrays: [],
    getRanNum: function () {
        const ranNum = Math.floor(Math.random() * 5)
        if (this.idArrays.includes(ranNum)) {
            return this.getRanNum();
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

    add: function (objToAdd) {
        const newTodo = {
            id: this.getRanNum(),
            name: objToAdd.name,
            status: 'todo',
            tag: objToAdd.tag
        }
        this.idArrays.push(newTodo.id)
        this.task.push(newTodo)
        let statusNum = this.getStatusNum(this.task)
        //printStatusNum함수 수정해보기.if문 사용하면 되지 않을까.
        console.log(`ID : ${newTodo.id}, ${newTodo.name} 항목이 추가되었습니다.`);
        this.printStatusNum(statusNum)
    },//해야할일과 id값을 추가해주는 함수

    update: function (objToUpdate) {
        let beforeTaskStatus = []
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
        console.log(`ID: ${changedTask[0].id}, ${changedTask[0].name} 항목이 ${beforeTaskStatus[0]} => ${changedTask[0].status} 상태로 업데이트 되었습니다.`)
        this.printStatusNum(statusNum)
    },//상태 업데이트 함수

    remove: function (objToRemove) {
        let extractedTask = this.task.filter(taskObj => taskObj.id === objToRemove.id)
        let deletedArrays = this.idArrays.filter(value => objToRemove.id !== value)
        this.idArrays = deletedArrays
        let removedTask = this.task.filter(taskObj => taskObj.id !== objToRemove.id)
        this.task = removedTask
        console.log(`ID : ${extractedTask[0].id}, ${extractedTask[0].name} 삭제 완료`)
    },//할 일과 id값을 제거해주는 함수

    printTask: function () {
        console.log(`입력된 할 일들`)
        this.task.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}, 태그 : ${obj.tag}`)
        })
    },//입력된 데이터들을 출력해주는 함수

    printSameTag: function (tag) {
        console.log(`현재 ${tag} 태그를 가진 할 일들은 다음과 같습니다.`);
        const tagSeparatedTask = this.task.filter(obj => {
            return obj.tag === tag
        })
        tagSeparatedTask.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}`)
        })
    }//tag가 같은 할 일들 출력
}//해야 할일 객체
//map filter중복적으로 사용하지 말아보기.
// 테스트

todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: 'C++', tag: 'programming' });
todo.add({ name: '회식', tag: '회사' });
todo.add({ name: '노래연습', tag: '자기개발' });
todo.add({ name: '과장님업무', tag: '회사' })

