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

function ToDoApp() {
  this.input = "";
  this.action = {};
  this.tasks = [];
  this.shortestRecord = null;
  this.state = {
    [admin.state.todo]: 0,
    [admin.state.doing]: 0,
    [admin.state.done]: 0
  };
  this.createdId = 0;
  this.generateId = (() => {
    let id = -1;

    return () => {
      id += 1;
      return id;
    };
  })();
}

const method = {
  consturctor: ToDoApp,

  generateId: (() => {
    let id = 0;

    return () => {
      id += 1;
      return id;
    };
  })(),

  log(message) {
    console.log(message);
  },

  currentState() {
    const { messages: { currentStateMessage } } = admin;
    const { state: { todo, doing, done } } = this;

    return currentStateMessage(todo, doing, done);
  },

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
  },

  shortestRecord() {
    const { shortestRecordMessgage, isComplete } = admin.messages;

    this.shortestRecord
      ? this.log(shortestRecordMessgage(this.shortestRecord))
      : this.log(isComplete);
  },

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
  },

  reducer() {
    const { cmd: { add, show, update }, state: { todo, doing, done } } = admin;
    let { action: { type, payload: { things, id, state } } } = this;

    switch (type) {
      case add: {
        this.createdId = this.generateId();
        this.tasks = this.tasks.concat(new Task(this.createdId, things));
        this.state[admin.state.todo] += 1;
        break;
      }

      case show:
        break;

      case update: {
        const newTasks = this.tasks.slice();
        const target = newTasks[id];
        const tempState = target.state;

        this.state[tempState] -= 1;
        this.state[state] += 1;

        target.state = state;

        switch (state) {
          case todo:
            target.started = null;
            target.ended = null;
            break;

          case doing:
            target.started = new Date();
            break;

          case done:
            target.ended = new Date();

            if (target.started) {
              target.runTime = (target.ended - target.started) / 1000;

              if (this.shortestRecord > target.runTime || !this.shortestRecord)
                this.shortestRecord = target.runTime;
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
  },

  view() {
    const {
      cmd: { add, show, update },
      messages: { addComplete, updateComplete }
    } = admin;
    let { action: { type, payload }, createdId, tasks } = this;

    switch (type) {
      case add: {
        const { id, things } = tasks[createdId];

        this.log(addComplete(id, things));

        this.log(this.currentState());

        break;
      }

      case show:
        this.log(this.showTasks(payload.state));
        break;

      case update: {
        const { id, things } = tasks[payload.id];

        this.log(updateComplete(id, things));

        this.log(this.currentState());

        break;
      }
    }

    return this;
  },

  validateRequest(input) {
    const {
      standard,
      cmd: { add, show, update },
      state: { todo, doing, done }
    } = admin;

    const addCase = new RegExp(`${add}\\${standard}.+`);
    const showCase = new RegExp(
      `${show}\\${standard}(${todo}|${doing}|${done})`
    );
    const updateCase = new RegExp(
      `${update}\\${standard}\\d+\\${standard}(${todo}|${doing}|${done})`
    );

    const isUpdateCaseCorrect =
      updateCase.test(input) &&
      parseInt(input.split(admin.standard)[1]) < this.tasks.length;

    if (addCase.test(input)) {
      return true;
    } else if (showCase.test(input)) {
      return true;
    } else if (isUpdateCaseCorrect) {
      return true;
    }

    return false;
  },

  getRequest(query) {
    const {
      cmd: { shortestRecord },
      messages: { question, retry, quitNotice }
    } = admin;

    rl.question(query, input => {
      if (input === admin.cmd.quit) {
        console.log(quitNotice);
        rl.close();
      } else if (input === shortestRecord) {
        this.shortestRecord();

        this.getRequest(question);
      } else if (this.validateRequest(input)) {
        this.input = input;

        this.actionCreator()
          .reducer()
          .view();

        this.getRequest(question);
      } else {
        this.getRequest(retry);
      }
    });
  }
};

ToDoApp.prototype = method;
const todoApp = new ToDoApp();

todoApp.getRequest(admin.messages.question);
