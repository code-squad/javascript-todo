let taskList = [];
let id = [];
const todo = {
    add(task) {
        this.id = id.length + 1;
        id.push(this.id);
        task.id = this.id;
        task.status = 'todo';
        taskList.push(task);
        console.log(`id : ${this.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: #개, doing: #개, done: #개 `);
    },
    update(idAndStatus) {
        const taskToUpdate = taskList.find(idAndStatus => idAndStatus.id === this.id);
        const before = taskToUpdate.status;
        const after = idAndStatus.nextstatus;
        taskToUpdate.status = after;
        console.log(`id : ${taskToUpdate.id}, "${taskToUpdate.name}" 항목이 ${before} => ${after} 상태로 업데이트 되었습니다. 
현재 상태 - todo: #개, doing: #개, done: #개`);
    },
    remove(id) {
        const taskToRemove = taskList.find(id => id.id === id.id);
        console.log(`id : ${id.id}, "${taskToRemove.name}" 삭제 완료.`);
        taskList.splice(taskList.indexOf(taskToRemove),1);
    }
}
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
todo.add({
    name: "자바스크립트 공부하기",
    tag: "programming"
});

todo.add({
    name: "자바스크립트 공부하기2",
    tag: "programming"
});
// console.log(taskList)

todo.update({
    id: 2,
    nextstatus: "done"
});

todo.remove({
    id: 1
});
