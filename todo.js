'use strict';

class Task {
  constructor(id, title, state, saveTime) {
    this.id = id;
    this.title = title;
    this.state = state;
    this.saveTime = saveTime;
  }
}

class Todo {
  constructor() {
    this.taskList = [];
    this.stateList = ['todo', 'doing', 'done'];
  }

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
  }

  parseCmdStr(cmdStr) {
    return cmdStr.split('$');
  }

  addTask(taskName) {
    const taskId = this.taskList.length + 1;
    const task = new Task(taskId, taskName, this.stateList[0], new Date());
    this.taskList.push(task);
    console.log(`>> id : ${taskId}, "${taskName}" 항목이 새로 추가됐습니다.`);
  }

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
  }

  showStateCount() {
    let stateCountMsg = '';
    for (let state in this.stateCount) {
      stateCountMsg += `${state}(${this.stateCount[state]}개), `;
    }
    console.log(`>> 현재 상태 : ` + stateCountMsg.slice(0, -2) + `\n`);
  }

  showTasksByState(state) {
    const taskListByState = this.taskList.filter(task => task.state === state);

    let resultMsg = '';
    if (taskListByState.length) {
      resultMsg = taskListByState.reduce((msg, task) => {
        msg += `\n"${task.id}, ${task.title}`;
        if (task.timeTaken) msg += `, ${this.getMsgTimeTaken(task.timeTaken)}`;
        msg += '"';
        return msg;
      }, '');
    }
    else resultMsg = `에 해당하는 값이 없습니다.`;

    console.log(`[${state}]${resultMsg}\n`);
  }

  updateTaskState(taskId, state) {
    const task = this.taskList[taskId - 1];

    if (!task) throw `없는 id 입니다.`;
    if (!this.stateList.includes(state)) throw `존재하지 않는 상태로 변경 불가능합니다.`;

    task.state = state;

    this.updateTaskTime(task, new Date());

    const resultMsg = `>> "${task.title}"가 "${state}"상태로 변경되었습니다.`;
    console.log(resultMsg);
  }

  updateTaskTime(task, newTime) {
    if (task.state === this.stateList[2]) {
      task.timeTaken = this.getTimeTaken(task.saveTime, newTime);
    }
    task.saveTime = newTime;
  }

  getTimeTaken(startTime, endTime) {
    let diffTimeInMs = endTime - startTime;

    const msPerSec = 1000;
    const msPerMin = 60 * msPerSec;
    const msPerHour = 60 * msPerMin;
    const msPerDay = 24 * msPerHour;

    const day = Math.floor(diffTimeInMs / msPerDay);
    diffTimeInMs %= msPerDay;
    const hour = Math.floor(diffTimeInMs / msPerHour);
    diffTimeInMs %= msPerHour;
    const min = Math.floor(diffTimeInMs / msPerMin);
    diffTimeInMs %= msPerMin;
    const sec = Math.floor(diffTimeInMs / msPerSec);
    const ms = diffTimeInMs % msPerSec;

    return {
      day,
      hour,
      min,
      sec,
      ms
    };
  }

  getMsgTimeTaken(timeTaken) {
    const koTimeUnit = {
      day: '일',
      hour: '시간',
      min: '분',
      sec: '초',
      ms: '밀리초'
    }
    let msgTimeTaken = '';
    for (let unit in timeTaken) {
      if (timeTaken[unit]) {
        msgTimeTaken += timeTaken[unit] + koTimeUnit[unit] + ' ';
      }
    }
    return msgTimeTaken.slice(0, -1);
  }
}

const todoApp = new Todo();

todoApp.command('add$자바스크립트 공부');
todoApp.command('add$알고리즘 공부');
todoApp.command('show$todo');
todoApp.command('update$2$doing');
todoApp.command('show$doing');
todoApp.command('update$2$done');
todoApp.command('show$done');