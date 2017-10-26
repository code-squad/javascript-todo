var Task = require('./task');
var statusConstant = require('./constants').status;
var polyfill = require('./utils').polyfill;

var app = {
    taskList: [],
    indexOfLeastTimeSpent: null, //index of task that spent least time
    count: {
        todo: 0,
        doing: 0,
        done: 0
    },
    showCurrentStatus: function () {
        console.log('현재상태: ' +
            statusConstant.TODO + ': ' + this.count.todo + '개, ' +
            statusConstant.DOING + ': ' + this.count.doing + '개, ' +
            statusConstant.DONE + ': ' + this.count.done + '개');

        if (this.indexOfLeastTimeSpent !== null) {
            var taskSpentLeastTime = this.taskList[this.indexOfLeastTimeSpent];

            console.log('가장 빨리 완료한 작업 id: ' + taskSpentLeastTime.id + ', 걸린 시간:', taskSpentLeastTime.timeSpentString);
        }
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
                console.log(`${task.id}, ${task.content}, ${task.timeSpentString}`);
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
            this.count[status]++;
            targetTask.updateStatus(status);

            //3초 후에 결과 출력
            if (status === statusConstant.DONE) {
                this.updateSpentLeastTime(targetTask);
                setTimeout(this.showCurrentStatus.bind(this), 3000);
            } else {
                this.showCurrentStatus();
            }
        }
    },
    updateSpentLeastTime: function(newTask) {
        var newTaskIndex = polyfill.findIndex(this.taskList, function (item) {
            return item.id === newTask.id;
        });

        if (this.indexOfLeastTimeSpent === null) {
            this.indexOfLeastTimeSpent = newTaskIndex;
            return ;
        }

        var taskLeastTimeSpent = this.taskList[this.indexOfLeastTimeSpent];
        var leastTime = taskLeastTimeSpent.timeSpent;

        if (leastTime > newTask.timeSpent) {
            this.indexOfLeastTimeSpent = newTaskIndex;
        }
    }
}

module.exports = app;
