var readline = require("readline");

var admin = require("./admin");
var util = require("./util");

var log = util.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var data = [];

function Task(things) {
  this.id = util.generateId();
  this.state = admin.state.todo;
  this.things = things;

  this.started = null;
  this.ended = null;
  this.runTime = null;
  this.runTimeMessage = null;
}

var helper = {
  standard: "$",

  cmd: {
    add: "add",
    show: "show",
    update: "update",
    quit: "quit",
    manual: "manual",
    shortestRecord: "shortestRecord"
  },

  state: {
    todo: "todo",
    doing: "doing",
    done: "done"
  },

  messages: {
    error() {
      log("잘못된 입력입니다.");
    },

    quit() {
      log("어플리케이션을 종료합니다.");
    },

    updateComplete(id) {
      log(`id: ${id} 항목이 업데이트 완료되었습니다.`);
    },

    addComplete(id, things) {
      log(`id: ${id}, "${things}" 항목이 새로 추가되었습니다.`);
    },

    currentState() {
      var todo = 0;
      var doing = 0;
      var done = 0;

      data.forEach(function(v) {
        if (v.state === helper.state.todo) todo += 1;
        else if (v.state === helper.state.doing) doing += 1;
        else if (v.state === helper.state.done) done += 1;
      });

      log(`현재 상태 : todo(${todo}), doing(${doing}), done(${done})\n`);
    },

    showTasks(inputState) {
      var arr = [];

      if (inputState === helper.state.done) {
        data.forEach(function(v) {
          if (v.state === helper.state[inputState])
            arr.push(`${v.things}, ${v.runTimeMessage}시간`);
        });
      } else {
        data.forEach(function(v) {
          if (v.state === helper.state[inputState])
            arr.push(`${v.id}, ${v.things}`);
        });
      }

      log(arr.join(", "));
    },

    shortestRecord() {
      var recode = 0;

      data.forEach(function(v) {
        var target = v.runTime;

        if (
          v.state === helper.state.done &&
          (recode === 0 || recode > target)
        ) {
          recode = target;
        }
      });

      recode === 0 ? log("아직 완료된 작업이 없습니다!") : log(`최단기록은 ${recode}밀리세컨드입니다!`);
    },

    manual() {
      var {
        cmd: { add, show, update, quit, shortestRecord },
        standard,
        state: { todo, doing, done }
      } = helper;

      log(`
${add}${standard}task를 통해 작업을 추가할 수 있습니다.\n
작업은 세 가지 상태로 관리됩니다. ${todo} ${doing} ${done}\n
${show}${standard}state를 통해 상태별 작업을 확인할 수 있습니다.\n
${show}${standard}${done}에서는 작업별 소요시간을 확인할 수 있습니다.\n
${show}${standard}${shortestRecord} 입력을 통해 가장 짧게 수행한 작업을 확인할 수 있습니다.\n
${update}${standard}${doing} 또는 ${update}${standard}${done}을 통해 상태를 변화시킬 수 있습니다.\n
입력값이 알맞지 않으면 재입력하셔야 합니다.\n
${quit}를 입력하시면 어플리케이션을 종료하실 수 있습니다.
      `);
    },
    manualQuestion: "\n원하시는 동작을 입력해주십시오.\n사용법은 manual을 입력하시면 확인하실 수 있습니다.\n"
  },

  actions: {
    retry() {
      helper.messages.error();
      client();
    },

    quit() {
      helper.messages.quit();
      rl.close();
    },

    addTask(things) {
      var newTask = new Task(things);

      data.push(newTask);
      helper.messages.addComplete(newTask.id, things);
      helper.messages.currentState();
    },

    updateTask(inputId, inputState) {
      if (inputState === helper.state.todo) helper.actions.retry();
      else if (
        inputState === helper.state.doing ||
        inputState === helper.state.done
      )
        for (var i = 0; i < data.length; i += 1) {
          var targetTask = data[i];

          if (targetTask.id === inputId && inputState === helper.state.doing) {
            targetTask.state = inputState;
            targetTask.started = new Date();
            helper.messages.updateComplete(inputId);
            break;
          } else if (
            targetTask.id === inputId &&
            inputState === helper.state.done
          ) {
            targetTask.state = inputState;
            targetTask.ended = new Date();
            targetTask.runTime =
              targetTask.ended -
              (targetTask.started === null
                ? targetTask.ended
                : targetTask.started);
            targetTask.runTimeMessage = new Date(
              targetTask.runTime
            ).getUTCHours();
            helper.messages.updateComplete(inputId, inputState);
            break;
          }
        }
      else helper.actions.retry();
    }
  }
};

function client() {
  rl.question(helper.messages.manualQuestion, function(input) {
    var splitInput = input.split(helper.standard);
    var secondCmd = splitInput[1];
    var thirdCmd = splitInput[2];

    switch (splitInput[0]) {
      case helper.cmd.add:
        helper.actions.addTask(secondCmd);
        break;

      case helper.cmd.show:
        if (secondCmd in helper.state) helper.messages.showTasks(secondCmd);
        else if (secondCmd === helper.cmd.shortestRecord)
          helper.messages.shortestRecord();
        else helper.actions.retry();
        break;

      case helper.cmd.update:
        if (thirdCmd === helper.state.doing || thirdCmd === helper.state.done)
          helper.actions.updateTask(parseInt(secondCmd), thirdCmd);
        else helper.actions.retry();
        break;

      case helper.cmd.manual:
        helper.messages.manual();
        break;

      case helper.cmd.quit:
        helper.actions.quit();
        return;

      default:
        helper.actions.retry();
    }

    client();
  });
}

client();
