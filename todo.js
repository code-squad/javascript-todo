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
            todo:0,
            doing:0,
            done:0
        }
        accumulatedTask.forEach(obj => {
            obj['status'] === 'todo' ? statusNum.todo++ :
            obj['status'] === 'doing' ? statusNum.doing++ :
            obj['status'] === 'done' ? statusNum.done++ :
            console.log('에러메세지 : 현재상태가 존재하지 않습니다.')
        })
        return statusNum
    },
    add: function (obj) {
        const newTodo = {
            id: this.getRanNum(),
            name: obj.name,
            status: 'todo',
            tag: obj.tag
        }
        task.push(newTodo)
        const statusNum = todo.getStatusNum(task)
        console.log(`id : ${newTodo.id}, '${newTodo.name}' 항목이 새로 추가되었습니다.
현재상태 todo : ${statusNum.todo}, doing: ${statusNum.doing}, done : ${statusNum.done}`)
    },//해야할일 추가 함수
    update: function (obj) {

    },//상태 업데이트 함수
    remove: function (obj) {

    },//할일 제거 함수
    printTask: function () {

    },//현재 해야할 일들과 상태를 출력해주는 함수
    showTags: function () {

    },//태그들의 이름을 출력해주는 함수
    printTagRelate: function (tag) {

    }//tag가 같은 할 일들 출력

}//해야 할일 객체

todo.add({name:'자바스크립트', tag:'programming'});
todo.add({name:'이름', tag:'getName'});
