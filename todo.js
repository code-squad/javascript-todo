let task = []//데이터를 축적시키는 배열
const todo = {
    getRanNum: function () {
        ranNum = Math.floor(Math.random() * 100);
        return this.checkOverlap(ranNum)
    },
    checkOverlap: function (num) {
        task.forEach(obj => {
            if (obj['id'] === num) {
                return this.getRanNum();
            }
            return num;
        })
    },
    getStatusNum: function () {
        let todo, doing, done = 0
        task.forEach(obj => {
            if (obj.status === 'todo') {
                todo = todo + 1
            } else if (obj.status === 'doing') {
                doing = doing + 1
            } else if (obj.status === 'done') {
                done = done + 1
            }
        })
        const status = [todo, doing, done]
        return status
    },
    add: function (obj) {
        const newTodo = {
            id: this.getRanNum(),
            name: obj.name,
            status: 'todo',
            tag: obj.tag
        }
        task.push(newTodo)
        const statusNumArrays = this.getStatusNum()
        console.log(`id : ${newTodo.id}, '${newTodo.name}' 항목이 새로 추가되었습니다.
    현재상태 : todo : ${statusNumArrays[0]}, doing: ${statusNumArrays[1]}, done : ${statusNumArrays[2]}`)
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

console.log(todo.add({name:'자바스크립트 공부하기', tag:'프로그래밍'}));
