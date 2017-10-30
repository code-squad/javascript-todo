"use strict";

var readline = require('./config/readline')();
var common = require('./src/common');
var processer = require('./src/command-processer');


(function () {
  common.messages.waitInsert();
  readline.prompt();

  readline.on('line', function (command) {
    processer.setCommand(command)

    if (processer.verifyCommand()) {
      processer.processCommand();
    } else {
      common.messages.commandError();
    }
    readline.prompt();
  });
})();