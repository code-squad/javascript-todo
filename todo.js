'use strict';

class Task {
  constructor(name, status) {
    this.name = name;
    this.status = status;
  }
}

const todoApp = {
  taskList: [],
  statusList: ['todo', 'doing', 'done'],

  command(cmdStr) {
    const parsedCmd = this.parseCmdStr(cmdStr);

    switch (parsedCmd[0]) {
      case 'add':
        const taskId = this.addTask(parsedCmd[1]);
        console.log(`\n>> id : ${taskId}, "${parsedCmd[1]}" 항목이 새로 추가됐습니다.`);

        const currentStatus = this.getStatusStat();
        this.showCurrentStatus(currentStatus);
        break;
    }
  },
  parseCmdStr(cmdStr) {
    return cmdStr.split('$');
  },
  addTask(taskName) {
    const taskId = this.taskList.push(new Task(taskName, this.statusList[0]));
    return taskId;
  },
  getStatusStat() {
    const statusStat = this.statusList.reduce((statObj, status) => {
      statObj[status] = 0;
      return statObj;
    }, {});

    this.taskList.forEach(task => {
      if (task.status in statusStat) statusStat[task.status]++;
    });

    return statusStat;
  },
  showCurrentStatus(currentStatus) {
    let currentStatusMsg = '';

    currentStatusMsg += `>> 현재 상태 : `;
    for (let status in currentStatus) {
      currentStatusMsg += `${status}(${currentStatus[status]}개), `;
    }

    console.log(currentStatusMsg.slice(0, -2));
  }
}

todoApp.command('add$자바스크립트 공부');
todoApp.command('add$알고리즘 공부');