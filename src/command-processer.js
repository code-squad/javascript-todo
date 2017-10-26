var common = require('./common');
var manager = require('./task-manager');

var commandProcesser = {
  command: [],
  setCommand: function (command) {
    this.command = command.split("$");
    return this;
  },
  verifyCommand: function () {
    switch (this.command[0]) {
      case common.COMMANDS.ADD:
        if (this.command.length !== 2)
          throw 'command error';
        break;
      case common.COMMANDS.SHOW:
        if (this.command.length !== 2)
          throw 'command error';
        break;
      case common.COMMANDS.UPDATE:
        if (this.command.length !== 3)
          throw 'command error';
        break;
      case common.COMMANDS.CHECK:
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
    switch (this.command[0]) {
      case common.COMMANDS.ADD:
        manager.addTask(command[1]);
        break;
      case common.COMMANDS.SHOW:
        manager.showTasks(command[1]);
        break;
      case common.COMMANDS.UPDATE:
        manager.updateTask(command[1], command[2]);
        break;
      case common.COMMANDS.CHECK:
        manager.checkShortestTask();
        break;
    }
    return this;
  },
  processError: function (error) {
    console.log(error);
  },
}

module.exports = commandProcesser;