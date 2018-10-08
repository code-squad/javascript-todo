const todo = {
    taskList: [],
    add(task) {
        task.status = 'todo';
        task.id = new Date().getUTCMilliseconds();
        this.taskList.push(task);
        let [todo, doing, done] = this.findStatus();
        console.log(`id : ${task.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개 `);
    },

    update(idAndStatus) {
        for (const values of this.taskList){
            if(values.id === idAndStatus.id){
                idAndStatus.nextstatus = idAndStatus.nextstatus.toLowerCase();
                console.log(`id : ${values.id}, "${values.name}" 항목이 (${values.status} => ${idAndStatus.nextstatus}) 상태로 업데이트되었습니다.`);
                values.status = idAndStatus.nextstatus;
                let [todo, doing, done] = this.findStatus();
                console.log(`현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
            }
        } 
    },

    remove(id) {
        const taskToRemove = this.taskList.find(id => id.id === id.id);
        console.log(`id : ${id.id}, "${taskToRemove.name}" 삭제 완료.`);
        this.taskList.splice(this.taskList.indexOf(taskToRemove), 1);
        statusList.splice(statusList.indexOf(taskToRemove), 1);
        idList.splice(idList.indexOf(taskToRemove), 1);
    },

    findStatus() {
        let [todo, doing, done] = [0, 0, 0];
        for (const values of this.taskList) {
                if (values.status === 'todo') {
                    todo++;
                }
                if (values.status === 'doing') {
                    doing++;
                }
                if (values.status === 'done') {
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
    id: todo.taskList[0].id,
    nextstatus: "DOING"
});

todo.remove({
    id: 1
});