"use strict";

var readline = require('./config/readline')();
var common = require('./src/common');
var processer = require('./src/command-processer');

(function () {
  common.messages.waitInsert();
  readline.prompt();

  readline.on('line', function (command) {
    try {
      processer.setCommand(command).verifyCommand().processCommand();
    }
    catch (error) {
      processer.processError(error);
    }
    readline.prompt();
  });
})();