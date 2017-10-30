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
        if (!this.isInStates(this.command[2]))
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
  isInStates: function (insertedState) {
    for (state in common.COMMANDS) {
      if (common.STATES[state] === insertedState) {
        return true;
      }
    }
    return false;
  },
  processCommand: function () {
    switch (this.command[0]) {
      case common.COMMANDS.ADD:
        manager.addTask(this.command[1]);
        break;
      case common.COMMANDS.SHOW:
        manager.showTasks(this.command[1]);
        break;
      case common.COMMANDS.UPDATE:
        manager.updateTask(this.command[1], this.command[2]);
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