const saveData = {
    task: [],//데이터를 축적시키는 배열
    idArrays: []
}
console.log(`할일의 상태가 done이라면 빨리 지워주세요.
데이터의 개수가 100개가 넘어가면 에러를 반환합니다.`);

const todo = {
    getRanNum: function () {
        const ranNum = Math.floor(Math.random() * 100)
        if(saveData.idArrays.indexOf(ranNum) !== -1) {
            return this.getRanNum() 
        }
        saveData.idArrays.push(ranNum)
        return ranNum
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
        saveData.task.push(newTodo)
        let statusNum = this.getStatusNum(saveData.task)
        console.log(`ID : ${newTodo.id}, ${newTodo.name} 항목이 추가되었습니다.`);
        todo.printStatusNum(statusNum)
    },//해야할일 추가 함수

    update: function (objToUpdate) {
        saveData.task = saveData.task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                taskObj.status = objToUpdate.nextstatus.toLowerCase();
                return taskObj
            }
            return taskObj
        })
        const changedTask = saveData.task.filter(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                return taskObj
            }
        })
        let statusNum = this.getStatusNum(saveData.task)
        console.log(`ID: ${changedTask[0].id}, ${changedTask[0].name} 항목이 todo => ${changedTask[0].status} 상태로 업데이트 되었습니다.`)
        todo.printStatusNum(statusNum)
    },//상태 업데이트 함수

    remove: function (objToRemove) {
        let extractedTask = saveData.task.filter(taskObj => taskObj.id === objToRemove.id)
        let deletedArrays = saveData.idArrays.filter(value => objToRemove.id !== value)
        saveData.idArrays = deletedArrays
        let removedTask = saveData.task.filter(taskObj => taskObj.id !== objToRemove.id)
        saveData.task = removedTask
        console.log(`ID : ${extractedTask[0].id}, ${extractedTask[0].name} 삭제 완료`)
    },//할일 제거 함수

    printTask: function () {
        console.log(`입력된 할 일들`)
        saveData.task.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}, 태그 : ${obj.tag}`)
        })
    },//현재 해야할 일들과 상태를 출력해주는 함수

    printTagRelate: function (tag) {
        console.log(`현재 ${tag} 태그를 가진 할 일들은 다음과 같습니다.`);
        const tagSeparatedTask = saveData.task.filter(obj => {
            return obj.tag === tag
        })
        tagSeparatedTask.forEach(obj => {
            console.log(`ID : ${obj.id}, 이름 : ${obj.name}, 상태 : ${obj.status}`)
        })
    }//tag가 같은 할 일들 출력
}//해야 할일 객체

todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: '이름', tag: 'getName' });
todo.add({ name: '이름1', tag: 'gmm' })
todo.add({ name: '이름2', tag: 'awef' })

