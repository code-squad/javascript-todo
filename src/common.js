var util = require('./src/utils');
var log = util.log;

var common = (function () {
  var STATE_CONST = {
    "TODO": 0,
    "DOING": 1,
    "DONE": 2
  };
  var messages = {
    waitInsert: function () {
    },
    taskAdded: function () {
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
    STATE_CONST,
    messages
  };
})();

module.exports = common;