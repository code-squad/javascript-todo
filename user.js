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
        var todo = 0;
        var doing = 0;
        var done = 0;
        this.tasks.map(function (task) {
            return task.status;
        }).forEach(function (status) {
            status === 0 ? todo++ : status === 1 ? doing++ : done++;
        })
        common.messages.showAll(todo, doing, done);
        return this;
    }
    User.prototype.addTask = function (title) {
        this.tasks.push({
            id: ++this.resp,
            title: title,
            status: 0
        });
        common.messages.add(this.resp, title);
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
            if (status === 0) {
                task = Object.assign(task, {
                    status: status
                });
            } else if (status === 1) {
                task = Object.assign(task, {
                    status: status,
                    time: new Date()
                });
            } else {
                task = Object.assign(task, {
                    status: status,
                    runtime: Math.round((new Date() - task.time) / 1000)
                });
                if (Object.keys(this.shortTask).length === 0 || this.shortTask.runtime > task.runtime) {
                    this.shortTask = task;
                }
            }
            return task;
        }.bind(this))
        return this;
    }
    return User;
})();


module.exports = User;