var common = require('./common');

var Manager = {
  tasks: [],
  nextId: 0,
  Task: function () {
    this.id = 0;
    this.name = "";
    this.state = "";
    this.startTime = 0;
    this.elapsedTime = 0;
  },
  addTask: function (name) {
    task = new this.Task;
    task.id = this.nextId;
    task.name = name;
    task.state = common.STATES.TODO;
    this.tasks.push(task);
    this.nextId++;
    common.messages.taskAdded(task.id, name);
    this.showAllTasks();
  },
  showState: function (insertedState) {
    var relevantTasks = [];
    this.tasks.forEach(function (task) {
      if (task.state === insertedState) {
        relevantTasks.push(task);
      }
    })
    common.messages.showState(relevantTasks);
  },
  showAllTasks: function () {
    var todoCount = 0, doingCount = 0, doneCount = 0;
    this.tasks.forEach(function (task) {
      if (task.state === common.STATES.TODO)
        todoCount++;
      if (task.state === common.STATES.DOING)
        doingCount++;
      if (task.state === common.STATES.DONE)
        doneCount++;
    });
    common.messages.showAll(todoCount, doingCount, doneCount);
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
    throw common.ERRORS.COMMAND_ERROR;
  },
  checkShortestTask: function () {
    return;
  }
};

module.exports = Manager;