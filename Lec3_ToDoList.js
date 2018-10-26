class Task {
    constructor(name, tag, id, status){
            this.name = name;
            this.tag = tag || '';
            this.id = Date.now() + Math.random();
            this.status = 'todo';
    }
}
const todo = {
    taskList: [],
    totalTakenTime: 0,

    getTaskList(){
        return this.taskList;
    },

    add(task) {
        if (errorCheck.add(task)) {
            // task.status = 'todo';
            // task.id = Date.now() + Math.random();
            this.taskList.push(task);
            history.checkCacheList('add', task);
            console.log(`id : ${task.id}, "${task.name}" 항목이 새로 추가되었습니다.`)
            this.printStatusCount();
        }
    },

    update(updateObj) {
        if (errorCheck.update(updateObj)) {
            const taskToUpdate = this.findTaskToUpdate(updateObj)[0];
            const statusToUpdate = this.findTaskToUpdate(updateObj)[1];
            this.executeUpdate(taskToUpdate, statusToUpdate);
            history.checkCacheList('update', taskToUpdate);
        }
    },

    remove(id) {
        if (!errorCheck.remove(id)) return;
        const taskToRemove = this.taskList.filter(values => values.id === id.id);
        history.checkCacheList('remove', taskToRemove[0]);
        this.taskList.splice(this.taskList.indexOf(taskToRemove[0]), 1);
        console.log(`id : ${taskToRemove[0].id}, "${taskToRemove[0].name}" 삭제 완료.`);
    },

    executeUpdate(taskToUpdate, statusToUpdate) {
        if (statusToUpdate === 'doing') {
            let doingTime = new Date().getTime();
            taskToUpdate.doingTime = doingTime;
            this.printUpdate(taskToUpdate, statusToUpdate);
            this.printStatusCount();
        }

        if (statusToUpdate === 'done') {
            let takenTime = (new Date().getTime() - taskToUpdate.doingTime) / 1000;
            this.totalTakenTime += takenTime;
            takenTime = this.getTakenTimeWithUnit(takenTime);
            taskToUpdate.takenTime = takenTime;
            this.printUpdate(taskToUpdate, statusToUpdate);
            this.printStatusCount();
        }
    },

    findTaskToUpdate(updateObj) {
        let taskToUpdate = {};
        const statusToUpdate = updateObj.nextstatus.replace(/ /gi, "").toLowerCase();
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
            takenTime = (takenTime / t.min).toFixed(0) + '분';
        } else if (takenTime <= t.d) {
            takenTime = (takenTime / t.hr).toFixed(0) + '시간';
        } else if (takenTime > t.d) {
            takenTime = (takenTime / t.d).toFixed(0) + '일';
        };
        return takenTime;
    },

    printUpdate(taskToUpdate, statusToUpdate) {
        console.log(
            `id : ${taskToUpdate.id}, "${taskToUpdate.name}" 항목이 (${taskToUpdate.status} => ${statusToUpdate}) 상태로 업데이트되었습니다.`);
        taskToUpdate.status = statusToUpdate;
    },

    printStatusCount() {
        let [todoCount, doingCount, doneCount] = this.countStatus(this.taskList);
        console.log(`현재 상태 - todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개`);
    },

    countStatus(taskList) {
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

    printTotalTime(){
        const totalTakenTime = this.getTakenTimeWithUnit(this.totalTakenTime);
        console.log(`당신이 열심히 산 시간 : ${totalTakenTime}`);
    },
}

const history = {
    cacheList: [],
    undoCacheList: [],
    // cacheList에 task 3개로 유지
    checkCacheList(func, task) {
        this.cacheList.push(func, Object.assign({}, task));
        this.fixArrLength(this.cacheList)
    },

    removeOldTask(arr) {
        arr.pop();
        arr.pop();
    },

    fixArrLength(arr) {
        while (arr.length > 6) {
            arr.shift();
        }
    },

    undo() {
        if (this.cacheList.length === 0) {
            console.log(`undo는 세 번까지 가능합니다.`);
            return;
        }
        const undoFunction = this.cacheList[this.cacheList.length - 2];
        const undoArg = this.cacheList[this.cacheList.length - 1];
        this.removeOldTask(this.cacheList)
        if (undoFunction === 'add') {
            this.undoAdd(undoArg);
        } else if (undoFunction === 'remove') {
            this.undoRemove(undoArg);
        } else if (undoFunction === 'update') {
            undoArg.previousStatus = undoArg.status;
            this.undoUpdate(undoArg);
        }
        this.undoCacheList ? this.undoCacheList.push(undoFunction, undoArg) : this.undoCacheList = [undoFunction, undoArg];
        this.fixArrLength(this.undoCacheList);
    },

    redo() {
        if (this.undoCacheList.length === 0) {
            console.log(`redo 할 게 없습니다.`);
            return;
        }
        const redoFunction = this.undoCacheList[this.undoCacheList.length - 2];
        const redoArg = this.undoCacheList[this.undoCacheList.length - 1];
        this.removeOldTask(this.undoCacheList)
        this.cacheList.push(redoFunction, redoArg);
        if (redoFunction === 'add') {
            this.redoAdd(redoArg);
        }
        if (redoFunction === 'remove') {
            this.redoRemove(redoArg);
        }
        if (redoFunction === 'update') {
            this.redoUpdate(redoArg);
        }
    },

    undoAdd(undoArg) {
        for (const values of todo.getTaskList()) {
            if (values.id === undoArg.id) {
                console.log(`id : ${values.id}, "${values.name}" 삭제 완료.`);
                todo.getTaskList().splice(todo.getTaskList().indexOf(values), 1);
            }
        }
    },

    undoRemove(undoArg) {
        todo.getTaskList().push(undoArg);
        let [todoCount, doingCount, doneCount] = todo.countStatus(todo.getTaskList());
        console.log(`id : ${undoArg.id}, "${undoArg.name}" 항목이 새로 추가되었습니다.
    현재 상태 - todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개 `);
    },

    undoUpdate(arg) {
        const taskToUndoUpdate = todo.getTaskList().filter(values => values.id === arg.id);
        if (arg.status === 'done') {
            this.printUndoUpdate(arg, 'doing', taskToUndoUpdate);
            return;
        }
        if (arg.status === 'doing') {
            this.printUndoUpdate(arg, 'todo', taskToUndoUpdate);
            return;
        }
    },

    printUndoUpdate(arg, changingStatus, taskToUndoUpdate) {
        todo.printUpdate(arg, changingStatus);
        arg.status = changingStatus;
        todo.getTaskList()[todo.getTaskList().indexOf(taskToUndoUpdate[0])] = arg;
        todo.printStatusCount();
    },

    redoAdd(redoArg) {
        todo.getTaskList().push(redoArg);
        console.log(`id : ${redoArg.id}, "${redoArg.name}" 항목이 새로 추가되었습니다.`);
        todo.printStatusCount();
    },

    redoRemove(redoArg) {
        console.log(`id : ${redoArg.id}, "${redoArg.name}" 삭제 완료.`);
        todo.getTaskList().splice(todo.getTaskList().indexOf(redoArg), 1);
    },

    redoUpdate(redoArg) {
        for (const values of todo.getTaskList()) {
            if (values.id === redoArg.id) {
                todo.printUpdate(redoArg, redoArg.previousStatus);
                redoArg.previousStatus = redoArg.status;
                todo.getTaskList()[todo.getTaskList().indexOf(values)] = redoArg;
                todo.printStatusCount();
            }
        }
    }
}

const errorCheck = {
    add(task) {
        let answer = true;
        for (const values of todo.getTaskList()) {
            if (task.name === values.name) {
                answer = false;
            }
        }
        if (answer) {
            return answer;
        }
        console.log(`[error] 이미 같은 이름에 task가 존재합니다.`);
        return answer;
    },

    update(updateObj) {
        let answer = false;
        for (const values of todo.getTaskList()) {
            if (updateObj.id === values.id) {
                answer = true;
            }
            if (answer === true) {
                const statusToUpdate = updateObj.nextstatus.replace(/ /gi, "").toLowerCase();
                if (statusToUpdate === values.status) {
                    console.log(`[error] ${values.id}번은 이미 ${statusToUpdate}입니다.`);
                    answer = false;
                    return answer;
                }
                const statusOrder = ['todo', 'doing', 'done'];
                if (statusOrder.indexOf(values.status) > statusOrder.indexOf(statusToUpdate)) {
                    console.log(`[error] ${values.status} 상태에서 ${statusToUpdate} 상태로 갈 수 없습니다.`);
                    answer = false;
                    return answer;
                }
                if (statusOrder.indexOf(statusToUpdate) - statusOrder.indexOf(values.status) > 1) {
                    console.log(`[error] 단계를 건너뛸 수 없습니다.`);
                    answer = false;
                    return answer;
                }
                if (answer) {
                    return answer;
                }
            }
        }
        if (!answer) {
            console.log(`[error] ${updateObj.id}번 아이디는 존재하지 않습니다.`);
            return answer;
        }
    },

    remove(id) {
        let answer = false;
        for (const values of todo.getTaskList()) {
            if (id.id === values.id) {
                answer = true;
                return answer;
            }
        }
        if (!answer) {
            console.log(`[error] ${id.id}번 아이디는 존재하지 않습니다.`);
            return answer;
        }
        return answer;
    },
}

const show = {
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
        const result = todo.getTaskList().filter(value => value.tag === tag);
        const [todoCount, doingCount, doneCount] = todo.countStatus(result);
        console.log(`tag가 "${tag}"인 할 일: `);
        if (todoCount !== 0) {
            this.printShowTag('todo', result, todoCount);
        }
        if (doingCount !== 0) {
            this.printShowTag('doing', result, doingCount);
        }
        if (doneCount !== 0) {
            this.printShowTag('done', result, doneCount);
        }
    },

    printShowTag(status, result, statusCount) {
        console.log(`[${status}, 총 ${statusCount}개]`);
        const taskWithSameStatus = result.filter(value => value.status === status);
        taskWithSameStatus.forEach(function (task) {
            console.log(`- ${task.id}번, ${task.name}`);
        });
    },

    showTags() {
        const result = todo.getTaskList().filter(value => value.tag !== 0);
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
        for (const values of todo.getTaskList()) {
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
        const [todoCount, doingCount, doneCount] = todo.countStatus(todo.getTaskList());
        console.log(`총 ${todoCount + doingCount + doneCount}개의 리스트를 가져왔습니다. 2초 뒤에 todo 내역을 출력합니다...`);
        const statusOrder = ['todo', 'doing', 'done'];
        const CountOrder = [todoCount, doingCount, doneCount];
        const timeOrder = [2000, 3000, 2000];
        this.setTime(statusOrder, CountOrder, timeOrder, 0);
    },

    setTime(statusOrder, CountOrder, timeOrder, n) {
        setTimeout(function () {
            if (n > 2) {
                return;
            }
            console.log(`[${statusOrder[n]}, 총 ${CountOrder[n]}개]`);
            this.printShowAll(this.sortTaskByStatus(statusOrder[n]));
            if (n < 2) {
                console.log(`\n 지금부터 ${timeOrder[n + 1] / 1000}초 뒤에 ${statusOrder[n + 1]} 내역을 출력합니다...`);
            }
            this.setTime(statusOrder, CountOrder, timeOrder, n + 1)
        }.bind(this), timeOrder[n]);
    },

    sortTaskByStatus(status) {
        let tasks = [];
        for (const values of todo.getTaskList()) {
            if (values.status === status) {
                tasks.push(values);
            }
        }
        return tasks;
    },

    printShowAll(arr) {
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
// todo.add(new Task("자바스크립트 공부하기","programming"));
// todo.add(new Task("알고리즘 공부하기","programming"));
// todo.add(new Task("요가하기","health"));
// todo.add(new Task("명상하기","health"));
// todo.add(new Task("독서하기","reading"));
// todo.add(new Task("기타치기","music"));

// todo.update({
//     id: todo.taskList[0].id,
//     nextstatus: "doing"
// });

// todo.update({
//     id: todo.taskList[1].id,
//     nextstatus: "doing"
// });

// todo.update({
//     id: todo.taskList[1].id,
//     nextstatus: "done"
// });

// todo.remove({
//     id: todo.taskList[0].id,
// });

// show.showTag('health');

// show.showTags();

// show.show("DONE")

// show.showAll();

// show.printShowAll(todo.taskList);