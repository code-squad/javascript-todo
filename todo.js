'use strict';

class Task {
  constructor(id, title, state) {
    this.id = id;
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
        this.getStateCount();
        this.showStateCount();
        break;

      case 'show':
        this.showTasksByState(parsedCmd[1]);
        break;

      case 'update':
        try { this.updateTaskState(parsedCmd[1], parsedCmd[2]); }
        catch (err) { console.error(`[!] update error : ${err}`); }
        this.getStateCount();
        this.showStateCount();
        break;

      default:
        console.error(`[!] 잘못된 명령입니다.`);
    }
  },
  parseCmdStr(cmdStr) {
    return cmdStr.split('$');
  },
  addTask(taskName) {
    const taskId = this.taskList.length + 1;
    const task = new Task(taskId, taskName, this.stateList[0]);
    this.taskList.push(task);
    console.log(`>> id : ${taskId}, "${taskName}" 항목이 새로 추가됐습니다.`);
  },
  getStateCount() {
    if (!this.stateCount) {
      // Create and initialize stateCount
      this.stateCount = this.stateList.reduce((resultObj, state) => {
        resultObj[state] = 0;
        return resultObj;
      }, {});
    }
    else {
      // Initialize only
      for (let state in this.stateCount) this.stateCount[state] = 0;
    }

    // Count
    this.taskList.forEach(task => {
      if (task.state in this.stateCount) this.stateCount[task.state]++;
    });
  },
  showStateCount() {
    let stateCountMsg = '';
    for (let state in this.stateCount) {
      stateCountMsg += `${state}(${this.stateCount[state]}개), `;
    }
    console.log(`>> 현재 상태 : ` + stateCountMsg.slice(0, -2) + `\n`);
  },
  showTasksByState(state) {
    const taskListByState = this.taskList.filter(task => task.state === state);

    let resultMsg = '';
    if (taskListByState.length) {
      resultMsg = taskListByState.reduce((msg, task) =>
        msg + `\n"${task.id}, ${task.title}"`
        , '');
    }
    else resultMsg = `에 해당하는 값이 없습니다.`;

    console.log(`[${state}]${resultMsg}\n`);
  },
  updateTaskState(taskId, state) {
    const task = this.taskList[taskId - 1];

    if (!task) throw `없는 id 입니다.`;
    if (!this.stateList.includes(state)) throw `존재하지 않는 상태로 변경 불가능합니다.`;

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