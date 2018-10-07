let taskList = [];
let idList = [];
let statusList = [];
const todo = {
    add(task) {
        this.id = idList.length + 1;
        task.id = this.id;
        task.status = 'todo';
        idList.push(this.id);
        taskList.push(task);
        statusList.push(task.status);
        const [todo, doing, done] = this.findStatus(statusList);
        console.log(`id : ${this.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개 `);
    },

    update(idAndStatus) {
        idAndStatus.nextstatus = idAndStatus.nextstatus.toLowerCase();
        const taskToUpdate = taskList.find(idAndStatus => idAndStatus.id === this.id);
        const before = taskToUpdate.status;
        const after = idAndStatus.nextstatus;
        taskToUpdate.status = after;
        statusList.splice(statusList.indexOf(taskToUpdate), 1);
        statusList.push(after);
        const [todo, doing, done] = this.findStatus(statusList);
        console.log(`id : ${taskToUpdate.id}, "${taskToUpdate.name}" 항목이 (${before} => ${after}) 상태로 업데이트되었습니다. 
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
    },

    remove(id) {
        const taskToRemove = taskList.find(id => id.id === id.id);
        console.log(`id : ${id.id}, "${taskToRemove.name}" 삭제 완료.`);
        taskList.splice(taskList.indexOf(taskToRemove), 1);
        statusList.splice(statusList.indexOf(taskToRemove), 1);
        idList.splice(idList.indexOf(taskToRemove), 1);
    },

    findStatus(statusList) {
        let todo = 0;
        let doing = 0;
        let done = 0;
        for (i = 0; i < statusList.length; i++) {
            if(statusList[i] === 'todo'){
                todo++;
            } else if(statusList[i] === 'doing'){
                doing++;
            } else if (statusList[i] === 'done'){
                done++;
            }
        }
        return [todo, doing, done];
    }
}

todo.add({
    name: "자바스크립트 공부하기",
    tag: "programming"
});

todo.add({
    name: "자바스크립트 공부하기2",
    tag: "programming"
});

todo.update({
    id: 2,
    nextstatus: "DOING"
});

todo.remove({
    id: 1
});

console.log(taskList)
console.log(idList)
console.log(statusList)
/*
> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
현재상태 :  todo:1개, doing:2개, done:2개

> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
현재상태 :  todo:1개, doing:1개, done:4개  

> todo.remove({id:3});
id:3, iOS공부하기 삭제완료. '
*/