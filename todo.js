'use strict';

class Task {
  constructor(title, state) {
    this.title = title;
    this.state = state;
  }
}

const todoApp = {
  taskList: [],
  stateList: ['todo', 'doing', 'done'],

  command(cmdStr) {
    const parsedCmd = this.parseCmdStr(cmdStr);

    switch (parsedCmd[0]) {
      case 'add':
        this.addTask(parsedCmd[1]);
        this.showStateCount(this.getStateCount());
        break;

      case 'show':
        this.showTasksByState(parsedCmd[1]);
        break;

      case 'update':
        try { this.updateTaskState(parsedCmd[1], parsedCmd[2]); }
        catch (err) { console.error(err); }
        this.showStateCount(this.getStateCount());
        break;

      default:
        console.error(`[!] 잘못된 명령입니다.`);
    }
  },
  parseCmdStr(cmdStr) {
    return cmdStr.split('$');
  },
  addTask(taskName) {
    const taskId = this.taskList.push(new Task(taskName, this.stateList[0]));
    console.log(`>> id : ${taskId}, "${taskName}" 항목이 새로 추가됐습니다.`);
  },
  getStateCount() {
    const stateCount = this.stateList.reduce((resultObj, state) => {
      resultObj[state] = 0;
      return resultObj;
    }, {});

    this.taskList.forEach(task => {
      if (task.state in stateCount) stateCount[task.state]++;
    });
    return stateCount;
  },
  showStateCount(stateCount) {
    let stateCountMsg = '';
    for (let state in stateCount) {
      stateCountMsg += `${state}(${stateCount[state]}개), `;
    }
    console.log(`>> 현재 상태 : ` + stateCountMsg.slice(0, -2) + `\n`);
  },
  showTasksByState(state) {
    let resultMsg = this.taskList.reduce((msg, task, taskIdx) => {
      if (state === task.state) msg += `\n"${taskIdx + 1}, ${task.title}"`;
      return msg;
    }, '');

    if (!resultMsg) resultMsg = `에 해당하는 값이 없습니다.`;

    console.log(`[${state}]${resultMsg}\n`);
  },
  updateTaskState(taskId, state) {
    const task = this.taskList[taskId - 1];
    if (!task) throw `[!] update error : 없는 id 입니다.`;

    task.state = state;

    const resultMsg = `>> "${task.title}"가 "${state}"상태로 변경되었습니다.`;
    console.log(resultMsg);
  }
}

todoApp.command('add$자바스크립트 공부');
todoApp.command('add$알고리즘 공부');
todoApp.command('show$todo');
todoApp.command('update$2$doing');
todoApp.command('show$doing');