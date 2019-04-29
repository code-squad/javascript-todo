class History {
  constructor(maxLength) {
    this.maxLength = maxLength;
    this.history = [];
    this.tempHistory = [];
  }
  append({ methodName, todo, changeStatus = '' }) {
    this.history.push({ methodName, todo, changeStatus });

    if (this.history.length > this.maxLength) {
      this.history.shift();
    }

    this.tempHistory = [];
    this.show();
  }
  undo() {}
  redo() {}
  show() {
    console.dir('history', this.history);
    console.dir('temphistory', this.tempHistory);
  }
}

const history = new History(3);
history.append({ methodName: 'add', todo: 1 });
history.append({ methodName: 'add', todo: 1 });
history.append({ methodName: 'add', todo: 1 });
history.append({ methodName: 'add', todo: 1 });
