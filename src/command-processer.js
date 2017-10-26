var util = require('./utils');
var log = util.log;

var commandProcesser = {
  command: [],
  setCommand: function (command) {
    this.command = command.split("$");
    return this;
  },
  //add, show, update, check
  //add length ==2 show ==2 update ==3 check ==1
  //update id 지정 잘못 할 경우 / state 지정 안 할 경우
  verifyCommand: function () {
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
    console.log(error);
  },
}

module.exports = commandProcesser;