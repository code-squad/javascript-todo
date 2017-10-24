"use strict";

var rl = require('./rl.js');
var User = require('./user.js');
var common = require('./common.js');

(function () {
    var user = new User();

    rl.on('line', function (answer) {
        var splitInput = answer.split("$");
        var cmd = splitInput[0];
        if (cmd === "add") {
            var title = splitInput[1];
            user.addTask(title);
        } else if (cmd === "show") {
            var status = common.STATUS_CONSTANT[splitInput[1]];
            user.showTasks(status);
        } else if (cmd === "update") {
            var id = splitInput[1];
            var status = common.STATUS_CONSTANT[splitInput[2]];
            user.updateTask(id, status);
        } else if (cmd === "short") {
            user.showShortTask();
        }
    });

})();