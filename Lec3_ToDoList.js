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
        idAndStatus.nextstatus = idAndStatus.nextstatus.trim().toLowerCase();
        for (const values of this.taskList) {
            if (values.id === idAndStatus.id && idAndStatus.nextstatus === 'doing') {
                values.doingTime = new Date().getTime();
                console.log(
                    `id : ${values.id}, "${values.name}" 항목이 (${values.status} => ${idAndStatus.nextstatus}) 상태로 업데이트되었습니다.`);
                values.status = idAndStatus.nextstatus;
                let [todo, doing, done] = this.findStatus(this.taskList);
                console.log(`현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
            }
            if (values.id === idAndStatus.id && idAndStatus.nextstatus === 'done') {
                let takenTime = (new Date().getTime() - values.doingTime)/1000;
                if (takenTime <= 60){
                    values.takenTime = takenTime+'초';
                } else if(takenTime <= 3600){
                    values.takenTime = (takenTime/60).toFixed(0) + '분';
                } else if(takenTime <= 86400){
                    values.takenTime = (takenTime/3600).toFixed(0) + '시간';
                } else if(takenTime > 86400){
                    values.takenTime = (takenTime/86400).toFixed(0) + '일';
                }
                
                delete values.doingTime;
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

    findTags(taskList) {
        let tagList = {};
        for (const values of taskList) {
            if (!tagList[values.tag]) {
                tagList[values.tag] = 1;
            } else if (tagList[values.tag])
                tagList[values.tag] += 1;
        }
        return tagList;
    },

    showTag(tag) {
        const result = this.taskList.filter(value => value.tag === tag);
        const [todo, doing, done] = this.findStatus(result);
        console.log(`tag가 "${tag}"인 할 일: `);
        if (todo !== 0) {
            console.log(`[todo, 총 ${todo}개]`);
            const todoTasks = result.filter(value => value.status === 'todo');
            todoTasks.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}`);
            });
        }
        if (doing !== 0) {
            console.log(`[doing, 총 ${doing}개]`);
            const doingTasks = result.filter(value => value.status === 'doing');
            doingTasks.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}`);
            });
        }
        if (done !== 0) {
            console.log(`[done, 총 ${done}개]`);
            const doneTasks = result.filter(value => value.status === 'done');
            doneTasks.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}`);
            });
        }
    },

    showTags() {
        const result = this.taskList.filter(value => value.tag !== 0);
        const tagList = this.findTags(result);
        for (const tag in tagList) {
            console.log(`\n[${tag}, 총 ${tagList[tag]}개]`);
            const sameTagTask = result.filter(result => result.tag === tag);
            sameTagTask.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}, [${task.status}]`);
            })
        }
    },

    show(status) {
        let showStatus = status.trim().toLowerCase();
        for (const values of this.taskList) {
            if (values.status === showStatus && showStatus !== 'done') {
                console.log(`- ${values.id}번, ${values.name}, [${values.tag}]`);
            }
            if (values.status === showStatus && showStatus === 'done') {
                console.log(`- ${values.id}번, ${values.name}, [${values.tag}], ${values.takenTime}`);
            }
        }
    }
    // countStatus(result) {
    //     let [todo, doing, done] = this.findStatus(result);
    //     if (todo !== 0) {
    //         console.log(`[todo, 총 ${todo}개]`);
    //         const todoTasks = result.filter(value => value.status === 'todo');
    //         todoTasks.forEach(function (task) {
    //             console.log(`- ${task.id}번, ${task.name}`);
    //         })
    //     }
    //     if (doing !== 0) {
    //         console.log(`[doing, 총 ${doing}개]`);
    //         const doingTasks = result.filter(value => value.status === 'doing');
    //         doingTasks.forEach(function (task) {
    //             console.log(`- ${task.id}번, ${task.name}`);
    //         })
    //     }
    //     if (done !== 0) {
    //         console.log(`[done, 총 ${done}개]`);
    //         const doneTasks = result.filter(value => value.status === 'done');
    //         doneTasks.forEach(function (task) {
    //             console.log(`- ${task.id}번, ${task.name}`);
    //         })
    //     }
    // }
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
    id: todo.taskList[0].id,
    nextstatus: "DOING"
});

todo.update({
    id: todo.taskList[0].id,
    nextstatus: "done"
});

// todo.remove({
//     id: todo.taskList[0].id,
// });

// todo.showTag('health');

// todo.showTags();

// console.log(todo.findTags(todo.taskList))

todo.show("done ")