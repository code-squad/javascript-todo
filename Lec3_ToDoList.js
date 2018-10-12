const todo = {
    taskList: [],
    add(task) {
        task.status = 'todo';
        task.id = Date.now() + Math.random();
        this.taskList.push(task);
        let [todo, doing, done] = this.CountStatus(this.taskList);
        console.log(`id : ${task.id}, "${task.name}" 항목이 새로 추가되었습니다.
현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개 `);
    },

    //idAndstatus 는 객체임으로, 이름을 o로 시작하거나, ht로 시작하거나, 아니면 이름끝네 object 라는 걸 넣어주어도 좋을 듯. 헝가리안표기법이 무엇인지도 좀 봐보세요~
    update(idAndStatus) { //설명드린대로, 하위 함수 36개로 분리해보세요!
        idAndStatus.nextstatus = idAndStatus.nextstatus.trim().toLowerCase();
        for (const values of this.taskList) {
            if (values.id === idAndStatus.id && idAndStatus.nextstatus === 'doing') {
                values.doingTime = new Date().getTime();
                console.log(
                    `id : ${values.id}, "${values.name}" 항목이 (${values.status} => ${idAndStatus.nextstatus}) 상태로 업데이트되었습니다.`);
                values.status = idAndStatus.nextstatus;
                let [todo, doing, done] = this.CountStatus(this.taskList);
                console.log(`현재 상태 - todo: ${todo}개, doing: ${doing}개, done: ${done}개`);
            }

            if (values.id === idAndStatus.id && idAndStatus.nextstatus === 'done') {
                let takenTime = (new Date().getTime() - values.doingTime) / 1000;
                //3600은 뭐고, 86400은 뭔지 변수에 이름을 저정해두는 건 어때요? ex. const min = 60;
                if (takenTime <= 60) {
                    values.takenTime = takenTime + '초';
                } else if (takenTime <= 3600) {
                    values.takenTime = (takenTime / 60).toFixed(0) + '분';
                } else if (takenTime <= 86400) {
                    values.takenTime = (takenTime / 3600).toFixed(0) + '시간';
                } else if (takenTime > 86400) {
                    values.takenTime = (takenTime / 86400).toFixed(0) + '일';
                };
                delete values.doingTime;
                console.log(
                    `id : ${values.id}, "${values.name}" 항목이 (${values.status} => ${idAndStatus.nextstatus}) 상태로 업데이트되었습니다.`);
                values.status = idAndStatus.nextstatus;
                let [todo, doing, done] = this.CountStatus(this.taskList);
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

    CountStatus(taskList) { //find 이름이 부적절~
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
        const [todoCount, doingCount, doneCount] = this.CountStatus(result);
        console.log(`tag가 "${tag}"인 할 일: `);
        //showTag의 조건문아래 코드부분은 약간씩 다르고 중복코드같은데요. 좀 어려울수도 있지만, 함수하나로 모아서 할수도 있을까요? (고민해보세요) (중복코드는 항상 제거하려고 해야해요)
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

    showTagPrint(status, result, statusCount){
        console.log(`[${status}, 총 ${statusCount}개]`);
        const taskWithSameStatus = result.filter(value => value.status === status);
        taskWithSameStatus.forEach(function (task) {
            console.log(`- ${task.id}번, ${task.name}`);
        });
    },

    showTags() {
        const result = this.taskList.filter(value => value.tag !== 0);
        const tagList = this.findTags(result);
        for (const tag in tagList) {
            console.log(`\n[${tag}, 총 ${tagList[tag]}개]`);
            const sameTagTask = result.filter(result => result.tag === tag);
            sameTagTask.forEach(function (task) {
                console.log(`- ${task.id}번, ${task.name}, [${task.status}]`);
            });
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
    },

    showAll() {
        const [todoCount, doingCount, doneCount] = this.CountStatus(this.taskList);
        console.log(`총 ${todoCount + doingCount + doneCount}개의 리스트를 가져왔습니다. 2초 뒤에 todo 내역을 출력합니다...`);

        setTimeout(function () {
            console.log(`[todo, 총 ${todoCount}개]`);
            let todoTasks = this.sortTaskByStatus('todo');
            this.showAllPrint(todoTasks);
            console.log(`\n 지금부터 3초 뒤에 doing 내역을 출력합니다...`);

            setTimeout(function () {
                console.log(`[doing, 총 ${doingCount}개]`);
                let doingTasks = this.sortTaskByStatus('doing');
                this.showAllPrint(doingTasks);
                console.log(`\n 지금부터 2초 뒤에 done 내역을 출력합니다...`);

                setTimeout(function () {
                    console.log(`[done, 총 ${doneCount}개]`);
                    let doneTasks = this.sortTaskByStatus('done');
                    this.showAllPrint(doneTasks);

                }.bind(this), 2000);

            }.bind(this), 3000);

        }.bind(this), 2000);



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
            if (!!!task.takenTime) {
                console.log(`- ${task.id}번, ${task.name}, [${task.tag}]`);
            } else if (task.takenTime) {
                console.log(`- ${task.id}번, ${task.name}, [${task.tag}], ${task.takenTime}`)
            };
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

todo.showTag('health');

// todo.showTags();

// todo.show("done ")

// todo.showAll();

// todo.showAllPrint(todo.taskList)