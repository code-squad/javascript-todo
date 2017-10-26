var common = require('./common.js');

var User = (function () {
    function User() {
        this.tasks = [];
        this.resp = 0;
        this.shortTask = {};
    }

    function Task(id, title, status, time, runtime) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.time = time;
        this.runtime = runtime;
    }
    User.prototype.showAllTask = function () {
        var statusCount = [0, 0, 0];
        this.tasks.forEach(function ({
            status
        }) {
            statusCount[status]++;
        })
        common.messages.showAll(statusCount);
        return this;
    }
    User.prototype.addTask = function (title) {
        var task = new Task(++this.resp, title, 0);
        this.tasks.push(task);
        common.messages.add(task.id, task.title);
        this.showAllTask();
        return this;
    }
    User.prototype.showTasks = function (status) {
        this.tasks.filter(function (task) {
            return task.status === status;
        }).forEach(function (task) {
            common.messages.showOne(task.id, task.title, task.runtime);
        }.bind(this));
        return this;
    }
    User.prototype.showShortTask = function () {
        common.messages.showShort(this.shortTask);
        return this;
    }
    User.prototype.updateTask = function (id, status) {
        this.tasks.filter(function (task) {
            return task.id === +id;
        }).map(function (task) {
            task.status = status;
            if (status === 1) {
                task.time = new Date();
            } else if (status === 2) {
                task.runtime = Math.round((new Date() - task.time) / 1000);
                if (Object.keys(this.shortTask).length === 0 || this.shortTask.runtime > task.runtime) {
                    this.shortTask = task;
                }
            }
            return task;
        }.bind(this));
        this.showAllTask();
        return this;
    }
    return User;
})();


module.exports = User;