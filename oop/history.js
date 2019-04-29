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

    // this.tempHistory = [];
  }

  undo() {
    const undoData = this.history.pop();
    this.tempHistory.push(undoData);

    return undoData;
  }

  redo() {
    const redoData = this.tempHistory.pop();
    this.history.push(redoData);

    return redoData;
  }

  show() {
    console.dir('history', this.history);
    console.dir('temphistory', this.tempHistory);
    console.dir('==============');
  }
}
