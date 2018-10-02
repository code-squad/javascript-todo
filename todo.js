const todo = {
    task: [],
    idArrays: [],
    getRanNum: function () {
        const ranNum = Math.floor(Math.random() * 5)
        if(this.idArrays.includes(ranNum)) {
            return this.getRanNum();
        }
        return ranNum;
    },

    getStatusNum: function (accumulatedTask) {
        const statusNum = {
            todo: 0,
            doing: 0,
            done: 0
        }
        accumulatedTask.forEach(obj => {
        obj['status'] === 'todo' ? statusNum.todo++ :
        obj['status'] === 'doing' ? statusNum.doing++ :
        obj['status'] === 'done' ? statusNum.done++ :
        console.log('에러메세지 : 현재상태가 존재하지 않습니다.')
        })
        return statusNum
    },

    printStatusNum: function (statusNum) {
        console.log(`현재상태 todo : ${statusNum.todo}, doing: ${statusNum.doing}, done : ${statusNum.done}`)
    },

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
        console.log(`ID : ${newTodo.id}, ${newTodo.name} 항목이 추가되었습니다.`);
        this.printStatusNum(statusNum)
    },//해야할일 추가 함수

    update: function (objToUpdate) {
        this.task = this.task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
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
        console.log(`ID: ${changedTask[0].id}, ${changedTask[0].name} 항목이 todo => ${changedTask[0].status} 상태로 업데이트 되었습니다.`)
        this.printStatusNum(statusNum)
    },//상태 업데이트 함수

    remove: function (objToRemove) {
        let extractedTask = this.task.filter(taskObj => taskObj.id === objToRemove.id)
        let deletedArrays = this.idArrays.filter(value => objToRemove.id !== value)
        this.idArrays = deletedArrays
        let removedTask = this.task.filter(taskObj => taskObj.id !== objToRemove.id)
        this.task = removedTask
        console.log(`ID : ${extractedTask[0].id}, ${extractedTask[0].name} 삭제 완료`)
    },//할일 제거 함수

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

// 테스트
todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: 'C++', tag: 'programming' });
todo.add({ name: '회식', tag: '회사' });
todo.add({ name: '노래연습', tag: '자기개발' });
todo.add({ name: '과장님업무', tag: '회사' })

