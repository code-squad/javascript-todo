var Task = require('./task');

var app {
    taskList: [],
    showCurrentStatus: function () {
        var counts = {
            statusConstant.TODO: 0,
            statusConstant.DOING: 0,
            statusConstant.DONE: 0
        }

        this.taskList.forEach(function(task) {
            var status = task.status;
            counts[status]++;
        });

        console.log(`현재상태 :
            ${statusConstant.TODO}:${counts[statusConstant.TODO]}개,
            ${statusConstant.DOING}:${counts[statusConstant.DOING]}개,
            ${statusConstant.DONE}:${counts[statusConstant.DONE]}개`);
    },
    show: function(status) {
        var tasks = this.taskList.filter(function(task) {
            return task.status === status;
        });

        if (tasks.length === 0) {
            throw `${status}상태의 task가 존재하지 않습니다.`;
        }

        if (status === statusConstant.DONE){
            tasks.forEach(function(task) {
                console.log(`${task.id}, ${task.content}, ${task.timeSpent}`);
            });
        } else {
            tasks.forEach(function(task) {
                console.log(`${task.id}, ${task.content}`);
            });
        }
    },
    add: function(content) {
        var newTask = new Task(content);

        this.taskList.push(newTask);

        console.log(`id: ${newTask.id},  "${newTask.content}" 항목이 추가되었습니다.`);
        this.showCurrentStatus();
    },
    update: function(id, status) {
        targetTaskId = parseInt(targetTaskId);

        var targetIndex = this.taskList.findIndex(function(task) {
            return task.id === targetTaskId;
        });

        var targetTask = (targetIndex >= 0) ? this.taskList[targetIndex] : undefined;

        if (targetTask === undefined) {
            throw `id가 ${id}인 task가 존재하지 않습니다.`;
        } else if (targetTask.status === status) {
            throw `해당하는 task가 이미 ${status}상태입니다.`;
        } else {
            //상태 변경
            targetTask.updateStatus(status);

            //3초 후에 결과 출력
            if (status === statusConstant.DONE) {
                setTimeout(this.showCurrentStatus.bind(this), 3000);
            } else {
                this.showCurrentStatus();
            }
        }
    }
}

module.exports = app;
