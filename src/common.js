var util = require('./utils');
var log = util.log;

var common = (function () {
  var STATES = {
    TODO: "todo",
    DOING: "doing",
    DONE: "done",
  };
  var COMMANDS = {
    ADD: "add",
    SHOW: "show",
    UPDATE: "update",
    CHECK: "check",
  };
  var ERRORS = {
    COMMAND_ERROR: "command error",
  };
  var messages = {
    waitInsert: function () {
      log('Please insert command');
    },
    taskAdded: function (id, name) {
      log('id: ' + id + ', ' + name + ' 항목이 추가되었습니다.');
    },
    showAll: function (todo, doing, done) {
      log('현재상태: todo: ' + todo + '개, doing: ' + doing + '개, done: ' + done + '개');
    },
    showState: function () {
    },
    showShortest: function () {
    },
    commandError: function (errorMessage) {
      log(errorMessage);
    }
  };

  return {
    STATES,
    COMMANDS,
    ERRORS,
    messages
  };
})();

module.exports = common;