var model {
    nextId: 1,
    taskLis: [],
    showCurrentStatus: function () {
        var counts = {
            todo: 0,
            doing: 0,
            done: 0
        }

        taskList.forEach(function(task) {
            var status = task.status;
            counts[status]++;
        });

        console.log(`현재상태 : todo:${counts.todo}개, doing:${counts.doing}개, done:${counts.done}개`);
    },
    show: function(status) {
        var tasks = taskList.filter(function(task) {
            return task.status === status
        });

        if (tasks.length === 0) {
            throw `${status}상태의 task가 존재하지 않습니다.`;
        } else if (status === 'done'){
            //완료 시간 계산
            tasks.forEach(function(task) {
                var timeDiff = null;

                if (task.startAt === undefined) {
                    timeDiff = task.doneAt - task.createdAt;
                } else {
                    timeDiff = task.doneAt - task.startAt;
                }

                var taskClearTime = Math.floor(timeDiff / 1000 / 60 / 60);

                console.log(`${task.id}, ${task.content}, ${taskClearTime}시간`);
            });
        } else {
            tasks.forEach(function(task) {
                console.log(`${task.id}, ${task.content}`);
            });
        }
    },
    add: function(content) {
        var newTask = {
            id: nextId++,
            status: 'todo',
            content: content,
            createdAt: new Date()
        }

        taskList.push(newTask);

        console.log(`id: ${newTask.id},  "${newTask.content}" 항목이 새로 추가됐습니다.`);
        showCurrentStatus();
    },
    update: function(id, status) {
        id = parseInt(id);
        var targetTask = taskList.find(function(task) {
            return task.id === id;
        });

        if (targetTask === undefined) {
            throw `id가 ${id}인 task가 존재하지 않습니다.`;
        } else if (targetTask.status === status) {
            throw `해당하는 task가 이미 ${status}상태입니다.`;
        } else {
            //상태 변경
            targetTask.status = status;

            //작업 시작/완료시각 저장
            if (status === 'doing') {
                targetTask.startAt = new Date();
            } else if (status === 'done') {
                targetTask.doneAt = new Date();
            }

            //3초 후에 결과 출력
            setTimeout(showCurrentStatus, 3000);
        }
    }
}

module.exports = model;
