// let taskList = [];
let idList = [];
let statusList = [];

const todo = {
    taskList: [],
    add(task) {
        this.id = idList.length + 1;
        task.id = this.id;
        task.status = 'todo';
        idList.push(this.id);
        this.taskList.push(task);
        statusList.push(task.status);
        const [todo, doing, done] = this.findStatus(statusList);
        console.log(`id : ${this.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개 `);
    },

    update(idAndStatus) {
        idAndStatus.nextstatus = idAndStatus.nextstatus.toLowerCase();
        const taskToUpdate = this.taskList.find(idAndStatus => idAndStatus.id === this.id);
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
        const taskToRemove = this.taskList.find(id => id.id === id.id);
        console.log(`id : ${id.id}, "${taskToRemove.name}" 삭제 완료.`);
        this.taskList.splice(this.taskList.indexOf(taskToRemove), 1);
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