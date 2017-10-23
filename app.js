"use strict";

var Store = (function () {
    function Store() {
        this.tasks = [];
        this.resp = 0;
        this.short = {};
        this.STATUS = [
            "todo",
            "doing",
            "done"
        ];
        this.messages = {
            add: function (id, title) {
                console.log("id: " + id + ", " + title + " 항목이 새로 추가됐습니다.");
            },
            show: function (id, title, runtime) {
                var result = "id: " + id + ", title: " + title;
                if (runtime)
                    result += ", runtime: " + runtime;
                console.log(result);
            },
            current: function (todo, doing, done) {
                console.log("현재상태 :  todo:" + todo + "개, doing:" + doing + "개, done:" + done + "개");
            },
            short: function (short) {
                console.log(short);
            }
        };
    }
    Store.prototype.confirmTask = function () {
        var todo = 0;
        var doing = 0;
        var done = 0;
        this.tasks.map(function (task) {
            return task.status;
        }).forEach(function (status) {
            status === 0 ? todo++ : status === 1 ? doing++ : done++;
        })
        this.messages.current(todo, doing, done);
        return this;
    }
    Store.prototype.addTask = function (title) {
        this.tasks.push({
            id: ++this.resp,
            title: title,
            status: 0
        });
        this.messages.add(this.resp, title);
        return this;
    }
    Store.prototype.showTasks = function (status) {
        this.tasks.filter(function (task) {
            return task.status === status;
        }).forEach(function (task) {
            this.messages.show(task.id, task.title, task.runtime);
        }.bind(this));
        return this;
    }
    Store.prototype.showShortTask = function () {
        this.messages.short(this.short);
        return this;
    }
    Store.prototype.updateTask = function (id, status) {
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
                if (Object.keys(this.short).length === 0 || this.short.runtime > task.runtime) {
                    this.short = task;
                }
            }
            return task;
        }.bind(this))
        return this;
    }
    Store.prototype.start = function () {
        rl.question('', function (answer) {
            var array = answer.split("$");
            var cmd = array[0];
            if (cmd === "add") {
                var title = array[1];
                this.addTask(title).confirmTask();
            } else if (cmd === "show") {
                var status = this.STATUS.indexOf(array[1]);
                this.showTasks(status);
            } else if (cmd === "update") {
                var id = array[1];
                var status = this.STATUS.indexOf(array[2]);
                this.updateTask(id, status).confirmTask();
            } else if (cmd === "short") {
                this.showShortTask();
            }
            this.start();
        }.bind(this));
        return this;
    }

    var rl = (function () {
        var readline = require('readline');
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return rl;
    })();

    return Store;
})();


(function () {
    var store = new Store();

    store.start();
})();