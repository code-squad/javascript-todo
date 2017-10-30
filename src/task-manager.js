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
    var taskCount = [0, 0, 0];
    this.tasks.forEach(function (task) {
      if (task.state === common.STATES.TODO)
        taskCount[0]++;
      if (task.state === common.STATES.DOING)
        taskCount[1]++;
      if (task.state === common.STATES.DONE)
        taskCount[2]++;
    });
    common.messages.showAll(taskCount);
  },
  updateTask: function (id, state) {
    for (task in this.tasks) {
      var currentTask = this.tasks[task];
      if (currentTask.id === +id) {
        currentTask.state = state;
        if (state === common.STATES.DOING)
          currentTask.startTime = new Date();
        if (state === common.STATES.DONE)
          currentTask.elapsedTime = new Date() - currentTask.startTime;
        this.showAllTasks();
        return;
      }
    }
    throw 'command error';
  },
  checkShortestTask: function () {
    return;
  }
};

module.exports = Manager;