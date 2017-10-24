var Task = require('./task');
var statusConstant = require('./constants').status;
var polyfill = require('./utils').polyfill;

var app = {
    taskList: [],
    count: {
        todo: 0,
        doing: 0,
        done: 0
    },
    showCurrentStatus: function () {
        console.log('현재상태 : ' +
            statusConstant.TODO + ': ' + this.count.todo + '개, ' +
            statusConstant.DOING + ': ' + this.count.doing + '개, ' +
            statusConstant.DONE + ': ' + this.count.done + '개');
    },
    show: function(status) {
        var tasks = this.taskList.filter(function(task) {
            return task.status === status;
        });

        if (tasks.length === 0) {
            throw new Error(`${status}상태의 task가 존재하지 않습니다.`);
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
        this.count.todo++;

        console.log(`id: ${newTask.id},  "${newTask.content}" 항목이 추가되었습니다.`);
        this.showCurrentStatus();
    },
    update: function(targetId, status) {
        targetId = parseInt(targetId);

        var targetIndex = polyfill.findIndex(this.taskList, function(task) {
            return task.id === targetId;
        });

        var targetTask = (targetIndex >= 0) ? this.taskList[targetIndex] : undefined;

        if (targetTask === undefined) {
            throw new Error(`id가 ${id}인 task가 존재하지 않습니다.`);
        } else if (targetTask.status === status) {
            throw new Error(`해당하는 task가 이미 ${status}상태입니다.`);
        } else {
            //상태 변경
            this.count[targetTask.status]--;
            targetTask.updateStatus(status);

            this.count[status]++;

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
