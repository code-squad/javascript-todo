const readline = require("readline");

const admin = require("./admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Task(id, things) {
  this.id = id;
  this.things = things;
  this.state = admin.state.todo;
  this.started = null;
  this.ended = null;
  this.runTime = null;
}

class ToDoApp {
  constructor() {
    this.input = "";
    this.action = {};
    this.tasks = [];
    this.record = null;
    this.createdId = 0;
    this.generateId = (() => {
      let id = -1;

      return () => {
        id += 1;
        return id;
      };
    })();
  }

  static log(message) {
    console.log(message);
  }

  currentState() {
    const {
      state: { todo, doing, done },
      messages: { currentStateMessage }
    } = admin;

    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;

    this.tasks.forEach(({ state }) => {
      if (state === todo) todoCount += 1;
      else if (state === doing) doingCount += 1;
      else if (state === done) doneCount += 1;
    });

    return currentStateMessage(todoCount, doingCount, doneCount);
  }

  showTasks(inputState) {
    const { done } = admin.state;
    const { tasks } = this;

    const arr = [];

    if (inputState === done) {
      tasks.forEach(({ things, state, runTime }) => {
        if (state === done) arr.push(`"${things}, ${runTime}초"`);
      });
    } else {
      tasks.forEach(({ state, id, things }) => {
        if (state === inputState) arr.push(`"${id}, ${things}"`);
      });
    }

    return arr.join(", ") + "\n";
  }

  shortestRecord() {
    const { shortestRecordMessgage, isComplete } = admin.messages;

    this.record
      ? ToDoApp.log(shortestRecordMessgage(this.record))
      : ToDoApp.log(isComplete);
  }

  actionCreator() {
    const { cmd: { add, show, update }, standard } = admin;

    const splited = this.input.split(standard);
    const cmdType = splited[0];
    const subType = splited[1];

    switch (cmdType) {
      case add:
        this.action = {
          type: cmdType,
          payload: {
            things: subType
          }
        };
        break;

      case show:
        this.action = {
          type: cmdType,
          payload: {
            state: subType
          }
        };
        break;

      case update:
        this.action = {
          type: cmdType,
          payload: {
            id: parseInt(subType),
            state: splited[2]
          }
        };
        break;
    }

    return this;
  }

  reducer() {
    const { cmd: { add, show, update }, state: { todo, doing, done } } = admin;
    let { action: { type, payload: { things, id, state } } } = this;

    switch (type) {
      case add: {
        this.createdId = this.generateId();
        this.tasks = this.tasks.concat(new Task(this.createdId, things));
        break;
      }

      case show:
        break;

      case update: {
        const newTasks = this.tasks.slice();
        const target = newTasks[id];

        target.state = state;

        switch (state) {
          case todo:
            break;

          case doing:
            target.started = new Date();
            break;

          case done:
            if (target.started) {
              target.ended = new Date();
              target.runTime = (target.ended - target.started) / 1000;

              if (this.record > target.runTime || !this.record)
                this.record = target.runTime;
            } else {
              target.started = target.ended;
              target.runTime = 0;
            }

            break;
        }

        this.tasks = newTasks;
      }
    }

    return this;
  }

  view() {
    const {
      cmd: { add, show, update },
      messages: { addComplete, updateComplete }
    } = admin;
    let { action: { type, payload }, createdId, tasks } = this;

    switch (type) {
      case add: {
        const { id, things } = tasks[createdId];

        ToDoApp.log(addComplete(id, things));

        ToDoApp.log(this.currentState());

        break;
      }

      case show:
        ToDoApp.log(this.showTasks(payload.state));
        break;

      case update: {
        const { id, things } = tasks[payload.id];

        ToDoApp.log(updateComplete(id, things));

        ToDoApp.log(this.currentState());

        break;
      }
    }

    return this;
  }
}

const validateRequest = input => {
  const {
    standard,
    cmd: { add, show, update },
    state: { todo, doing, done }
  } = admin;

  const addCase = new RegExp(`${add}\\${standard}.+`);
  const showCase = new RegExp(`${show}\\${standard}(${todo}|${doing}|${done})`);
  const updateCase = new RegExp(
    `${update}\\${standard}\\d+\\${standard}(${doing}|${done})`
  );

  const isUpdateCaseCorrect =
    updateCase.test(input) &&
    parseInt(input.split(admin.standard)[1]) < todoApp.tasks.length;

  if (addCase.test(input)) {
    return true;
  } else if (showCase.test(input)) {
    return true;
  } else if (isUpdateCaseCorrect) {
    return true;
  }

  return false;
};

const todoApp = new ToDoApp();

const getRequest = query => {
  const {
    cmd: { shortestRecord },
    messages: { question, retry, quitNotice }
  } = admin;

  rl.question(query, input => {
    if (input === admin.cmd.quit) {
      console.log(quitNotice);
      rl.close();
    } else if (input === shortestRecord) {
      todoApp.shortestRecord();

      getRequest(question);
    } else if (validateRequest(input)) {
      todoApp.input = input;

      todoApp
        .actionCreator()
        .reducer()
        .view();

      getRequest(question);
    } else {
      getRequest(retry);
    }
  });
};

getRequest(admin.messages.question);
