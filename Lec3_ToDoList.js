const todo = {
    taskList: [],
    add(task) {
        task.status = 'todo';
        task.id = Date.now() + Math.random();
        this.taskList.push(task);
        let [todoCount, doingCount, doneCount] = this.CountStatus(this.taskList);
        console.log(`id : ${task.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개 `);
    },

    update(updateObj) {
        const taskToUpdate = this.findTaskToUpdate(updateObj)[0];
        const statusToUpdate = this.findTaskToUpdate(updateObj)[1];
        this.executeUpdate(taskToUpdate, statusToUpdate);
    },

    executeUpdate(taskToUpdate, statusToUpdate) {
        if (statusToUpdate === 'doing') {
            let doingTime = new Date().getTime();
            taskToUpdate.doingTime = doingTime;
            this.printUpdate(taskToUpdate, statusToUpdate);
        }

        if (statusToUpdate === 'done') {
            let takenTime = (new Date().getTime() - taskToUpdate.doingTime) / 1000;
            takenTime = this.getTakenTimeWithUnit(takenTime);
            taskToUpdate.takenTime = takenTime;
            delete taskToUpdate.doingTime;
            this.printUpdate(taskToUpdate, statusToUpdate);
        }
    },

    findTaskToUpdate(updateObj) {
        let taskToUpdate = {};
        const statusToUpdate = updateObj.nextstatus.trim().toLowerCase();
        for (const values of this.taskList) {
            if (values.id === updateObj.id) {
                taskToUpdate = values;
            }
        }
        return [taskToUpdate, statusToUpdate];
    },

    getTakenTimeWithUnit(takenTime) {
        const t = {
            min: 60,
            hr: 3600,
            d: 86400
        };
        if (takenTime <= t.min) {
            takenTime = takenTime + '초';
        } else if (takenTime <= t.hr) {
            takenTime = (takenTime / min).toFixed(0) + '분';
        } else if (takenTime <= t.d) {
            takenTime = (takenTime / hr).toFixed(0) + '시간';
        } else if (takenTime > t.d) {
            takenTime = (takenTime / d).toFixed(0) + '일';
        };
        return takenTime;
    },

    printUpdate(taskToUpdate, statusToUpdate) {
        console.log(
            `id : ${taskToUpdate.id}, "${taskToUpdate.name}" 항목이 (${taskToUpdate.status} => ${statusToUpdate}) 상태로 업데이트되었습니다.`);
        taskToUpdate.status = statusToUpdate;
        let [todoCount, doingCount, doneCount] = this.CountStatus(this.taskList);
        console.log(`현재 상태 - todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개`);
    },

    remove(id) {
        for (const values of this.taskList) {
            if (values.id === id.id) {
                console.log(`id : ${id.id}, "${values.name}" 삭제 완료.`);
                this.taskList.splice(this.taskList.indexOf(values), 1);
            }
        }
    },

    CountStatus(taskList) {
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
        let tagObj = {};
        for (const values of taskList) {
            if (!tagObj[values.tag]) {
                tagObj[values.tag] = 1;
            } else if (tagObj[values.tag])
                tagObj[values.tag] += 1;
        }
        return tagObj;
    },

    showTag(tag) {
        const result = this.taskList.filter(value => value.tag === tag);
        const [todoCount, doingCount, doneCount] = this.CountStatus(result);
        console.log(`tag가 "${tag}"인 할 일: `);
        if (todoCount !== 0) {
            this.showTagPrint('todo', result, todoCount);
        }
        if (doingCount !== 0) {
            this.showTagPrint('doing', result, doingCount);
        }
        if (doneCount !== 0) {
            this.showTagPrint('done', result, doneCount);
        }
    },

    showTagPrint(status, result, statusCount) {
        console.log(`[${status}, 총 ${statusCount}개]`);
        const taskWithSameStatus = result.filter(value => value.status === status);
        taskWithSameStatus.forEach(function (task) {
            console.log(`- ${task.id}번, ${task.name}`);
        });
    },

    showTags() {
        const result = this.taskList.filter(value => value.tag !== 0);
        const tagObj = this.findTags(result);
        for (const tag in tagObj) {
            console.log(`\n[${tag}, 총 ${tagObj[tag]}개]`);
            const tasksWithSameObj = result.filter(result => result.tag === tag);
            tasksWithSameObj.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}, [${task.status}]`);
            });
        }
    },

    show(status) {
        let showStatus = status.replace(/ /g, "").toLowerCase();
        console.log(`상태가 ${showStatus}인 task(s):`);
        for (const values of this.taskList) {
            if (values.status !== showStatus) continue;
            this.printShow(values, showStatus);
        }
    },

    printShow(values, showStatus) {
        if (showStatus === 'done') {
            console.log(`- ${values.id}번, ${values.name}, [${values.tag}], ${values.takenTime}`)
        } else if (showStatus === 'doing' || showStatus === 'todo') {
            console.log(`- ${values.id}번, ${values.name}, [${values.tag}]`);
        }
    },

    showAll() {
        const [todoCount, doingCount, doneCount] = this.CountStatus(this.taskList);
        console.log(`총 ${todoCount + doingCount + doneCount}개의 리스트를 가져왔습니다. 2초 뒤에 todo 내역을 출력합니다...`);
        const statusOrder = ['todo', 'doing', 'done'];
        const CountOrder = [todoCount, doingCount, doneCount];
        const timeOrder = [2000, 3000, 2000]
        this.setTime(statusOrder, CountOrder, timeOrder, 0);
    },

    setTime(statusOrder, CountOrder, timeOrder, n) {
        setTimeout(function () {
            if (n > 2) {
                return;
            }
            console.log(`[${statusOrder[n]}, 총 ${CountOrder[n]}개]`);
            this.showAllPrint(this.sortTaskByStatus(statusOrder[n]));
            if (n < 2) {
                console.log(`\n 지금부터 ${timeOrder[n + 1] / 1000}초 뒤에 ${statusOrder[n + 1]} 내역을 출력합니다...`);
            }
            this.setTime(statusOrder, CountOrder, timeOrder, n + 1)
        }.bind(this), timeOrder[n]);
    },

    sortTaskByStatus(status) {
        let tasks = [];
        for (const values of this.taskList) {
            if (values.status === status) {
                tasks.push(values);
            }
        }
        return tasks;
    },

    showAllPrint(arr) {
        arr.forEach(function (task) {
            if (task.takenTime) {
                console.log(`- ${task.id}번, ${task.name}, [${task.tag}], ${task.takenTime}`)
            } else if (!task.takenTime) {
                console.log(`- ${task.id}번, ${task.name}, [${task.tag}]`);
            }
        });
    }
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
    id: todo.taskList[1].id,
    nextstatus: "DOING"
});

todo.update({
    id: todo.taskList[1].id,
    nextstatus: "done"
});

todo.remove({
    id: todo.taskList[0].id,
});

todo.showTag('health');

todo.showTags();

todo.show("DONE")

todo.showAll();

todo.showAllPrint(todo.taskList);