var common = require('./common');

var Manager = {
  tasks: [],
  nextId: 0,
  task: {
    id: 0,
    name: "",
    state: common.STATES.TODO,
    startTime: 0,
    elapsedTime: 0,
  },
  addTask: function (name) {
    this.task.id = this.nextId;
    this.task.name = name;
    this.task.state = common.STATES.TODO;
    this.tasks.push(this.task);
    this.nextId++;
    common.messages.taskAdded(this.task.id, name);
  },
  //
  showTasks: function (state) {
  },
  //
  showAllTasks: function () {
  },
  //doing이나 done으로 업데이트. doing이라면 시간 기록, done이라면 시간 비교해서 넣음
  updateTask: function (id, state) {
    for (task in this.tasks) {
      if (task.id == id) {
        task.state = state;
        break;
      }
    }
  },
  checkShortestTask: function () {
    return;
  }
};

module.exports = Manager;