'use strict';

class Task {
  constructor(name, status) {
    this.name = name;
    this.status = status;
  }
}

const todoApp = {
  command: function (cmdStr) {
    const parsedArr = this.parseCmdStr(cmdStr);
    console.log(parsedArr);
  },
  parseCmdStr: function (cmdStr) {
    return cmdStr.split('$');
  }
}

todoApp.command('add$자바스크립트 공부하기');