let task = []//데이터를 축적시키는 배열
const todo = {
    getRanNum: function () {
        ranNum = Math.floor(Math.random() * 10);
        return this.checkOverlap(ranNum)
    },

    checkOverlap: function (num) {
        task.forEach(obj => {
            if (obj['id'] === num) {
                return this.getRanNum();
            }
        })
        return num;
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
        task.push(newTodo)
        let statusNum = this.getStatusNum(task)
        console.log(`ID : ${newTodo.id}, ${newTodo.name} 항목이 추가되었습니다.`);
        todo.printStatusNum(statusNum)
    },//해야할일 추가 함수

    update: function (objToUpdate) {
        task = task.map(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                taskObj.status = objToUpdate.nextstatus.toLowerCase();
                return taskObj
            }
            return taskObj
        })
        const changedTask = task.filter(taskObj => {
            if (objToUpdate.id === taskObj.id) {
                return taskObj
            }
        })
        let statusNum = this.getStatusNum(task)
        console.log(`ID: ${changedTask[0].id}, ${changedTask[0].name} 항목이 todo => ${changedTask[0].status} 상태로 업데이트 되었습니다.`)
        todo.printStatusNum(statusNum)
    },//상태 업데이트 함수

    remove: function (objToRemove) {
        task.forEach(obj => {
            if(obj.id === objToRemove.id) {
                
            }
        })
    },//할일 제거 함수

    printTask: function () {

    },//현재 해야할 일들과 상태를 출력해주는 함수

    showTags: function () {

    },//태그들의 이름을 출력해주는 함수

    printTagRelate: function (tag) {

    }//tag가 같은 할 일들 출력
}//해야 할일 객체

todo.add({ name: '자바스크립트', tag: 'programming' });
todo.add({ name: '이름', tag: 'getName' });


