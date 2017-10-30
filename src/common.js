var util = require('./utils');
var log = util.log;

var common = (function () {
  var STATES = {
    "TODO": "todo",
    "DOING": "doing",
    "DONE": "done",
  };
  var COMMANDS = {
    ADD: "add",
    SHOW: "show",
    UPDATE: "update",
    CHECK: "check",
  }
  var messages = {
    waitInsert: function () {
      log('Please insert command');
    },
    taskAdded: function (id, name) {
      log('id: ' + id + ', ' + name + ' 항목이 추가되었습니다.');
    },
    showAll: function () {
    },
    showState: function () {
    },
    showShortest: function () {
    },
    commandError: function () {
    }
  };

  return {
    STATES,
    COMMANDS,
    messages
  };
})();

module.exports = common;