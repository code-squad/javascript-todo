const todo = {
    taskList: [],
    add(task) {
        task.status = 'todo';
        task.id = Date.now() + Math.random();
        this.taskList.push(task);
        let [todo, doing, done] = this.findStatus(this.taskList);
        console.log(`id : ${task.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개 `);
    },

    update(idAndStatus) {
        for (const values of this.taskList) {
            if (values.id === idAndStatus.id) {
                idAndStatus.nextstatus = idAndStatus.nextstatus.toLowerCase();
                console.log(
                    `id : ${values.id}, "${values.name}" 항목이 (${values.status} => ${idAndStatus.nextstatus}) 상태로 업데이트되었습니다.`);
                values.status = idAndStatus.nextstatus;
                let [todo, doing, done] = this.findStatus(this.taskList);
                console.log(`현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
            }
        }
    },

    remove(id) {
        for (const values of this.taskList) {
            if (values.id === id.id) {
                console.log(`id : ${id.id}, "${values.name}" 삭제 완료.`);
                this.taskList.splice(this.taskList.indexOf(values), 1);
            }
        }
    },

    findStatus(taskList) {
        let [todo, doing, done] = [0, 0, 0];
        for (const values of taskList) {
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
    },

    showTag(tag) {
        let result = [];
        for (const values of this.taskList) {
            if (values.tag === tag) {
                result.push(values);
            }
        }
        let [todo, doing, done] = this.findStatus(result);
        if (todo !== 0) {
            console.log(`[todo, 총 ${todo}개]`)
        }
        for (const resultTasks of result) {
            if (resultTasks.status === 'todo') {
                console.log(`- ${resultTasks.id}번, ${ resultTasks.name } `);
            }
        }
        if (doing !== 0) {
            console.log(`[doing, 총 ${doing}개]`)
        }
        for (const resultTasks of result) {
            if (resultTasks.status === 'doing') {
                console.log(`- ${resultTasks.id}번, ${ resultTasks.name } `);
            }
        }
        if (done !== 0) {
            console.log(`[done, 총 ${done}개]`)
        }
        for (const resultTasks of result) {
            if (resultTasks.status === 'done') {
                console.log(`- ${resultTasks.id}번, ${ resultTasks.name } `);
            }
        }
    },

}
//test
todo.add({
    name: "자바스크립트 공부하기",
    tag: "programming"
});

todo.add({
    name: "알고리즘 공부하기",
    tag: "programming"
});

todo.add({
    name: "요가하기",
    tag: "health"
});

todo.add({
    name: "명상하기",
    tag: "health"
});

todo.add({
    name: "독서하기",
    tag: "reading"
});

todo.add({
    name: "기타치기",
    tag: "music"
});


todo.update({
    id: todo.taskList[3].id,
    nextstatus: "DOING"
});

todo.remove({
    id: todo.taskList[0].id,
});

todo.showTag('health');