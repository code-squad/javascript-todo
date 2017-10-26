var util = require('./utils');
var common = require('./common');
var log = util.log;

var commandProcesser = {
  command: [],
  setCommand: function (command) {
    this.command = command.split("$");
    return this;
  },
  verifyCommand: function () {
    switch (this.command[0]) {
      case "add":
        if (this.command.length !== 2)
          throw 'command error';
        break;
      case "show":
        if (this.command.length !== 2)
          throw 'command error';
        break;
      case "update":
        if (this.command.length !== 3)
          throw 'command error';
        break;
      case "check":
        if (this.command.length !== 1)
          throw 'command error';
        break;
      default:
        throw 'command error';
    }
    return this;
  },
  //switch로 add show default:throw
  processCommand: function () {
  },
  processAdd: function () {

  },
  processShow: function () {

  },
  processUpdate: function () {

  },
  processCheck: function () {

  },
  //잘못된 명령
  processError: function (error) {
    log(error);
  },
}

module.exports = commandProcesser;