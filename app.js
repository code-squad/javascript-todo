"use strict";

var rl = require('./rl.js');
var User = require('./user.js');
var common = require('./common.js');

(function () {
    var user = new User();

    rl.on('line', function (answer) {
        var array = answer.split("$");
        var cmd = array[0];
        if (cmd === "add") {
            var title = array[1];
            user.addTask(title).showAllTask();
        } else if (cmd === "show") {
            var status = common.STATUS_CONSTANT[array[1]];
            user.showTasks(status);
        } else if (cmd === "update") {
            var id = array[1];
            var status = common.STATUS_CONSTANT[array[2]];
            user.updateTask(id, status).showAllTask();
        } else if (cmd === "short") {
            user.showShortTask();
        }
    });

})();