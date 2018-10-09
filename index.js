class Todo {
  constructor(message, todoObj, error, execution) {
    this.list = [];
    this.message = message;
    this.todoObj = todoObj;
    this.error = error;
    this.execution = execution;
  }

  add({ name, tag }) {
    const bError = this.error.inCaseAdd(this.list, name);
    if (bError) return;

    const newTask = {
      id: Date.now().toString(36),
      name: name,
      status: "todo",
      tag: tag
    };

    this.list.push(newTask);
    this.execution.record.pushUndoList("add", newTask);
    this.message.printCommandResult(this.list, "add", newTask);
  }

  update({ id, nextstatus }) {
    if (typeof arguments[0] === "string") {
      [id, nextstatus] = arguments[0].split("$").map(word => word.trim());
    }

    const targetTask = this.list.filter(task => task.id === id)[0];
    const nextStatus = nextstatus.toLowerCase();

    const bError = this.error.inCaseUpdate(this.list, targetTask, id, nextStatus);
    if (bError) return;

    const prevStatus = targetTask.status;
    const isDoingDone = prevStatus === "doing" && nextStatus === "done";

    this.execution.record.pushUndoList("update", targetTask, nextStatus);

    if (nextStatus === "doing") {
      targetTask.startTime = new Date(Date.now());
    }
    else if (isDoingDone) {
      targetTask.spentTime = Date.now() - targetTask.startTime;
    }
    else if (targetTask.startTime || targetTask.spentTime) {
      delete targetTask.startTime;
      delete targetTask.spentTime;
    }

    targetTask.status = nextStatus;

    this.message.printCommandResult(this.list, "update", targetTask, prevStatus);
  }

  remove({ id }) {
    const bError = this.error.inCaseRemove(this.list, id);
    if (bError) return;

    const targetIndex = this.list.findIndex(task => task.id === id);
    const targetTask = this.list[targetIndex];

    this.list.splice(targetIndex, 1);
    this.execution.record.pushUndoList("remove", targetTask);
    this.message.printCommandResult(this.list, "remove", targetTask);
  }

  showTag(tag) {
    this.message.listByTag(this.todoObj.tag(this.list, tag));
  }

  showTags() {
    this.message.listByAllTags(this.todoObj.tags(this.list));
  }

  show(status) {
    this.message.listByStatus(this.list, status);
  }

  showAll() {
    const asynTime = [2000, 3000, 2000];
    this.message.listByAllStatus(this.todoObj.status(this.list), this.list, asynTime);
  }

  undo() {
    this.execution.undo(this.list);
  }

  redo() {
    this.execution.redo(this.list);
  }
}

class Message {
  printCommandResult(todoList, command, task, prevStatus) {
    const countTodoStatus = status => todoList.filter(task => task.status === status).length;
    switch (command) {
      case "add":
        console.log(`id: ${task.id}, \"${task.name}\" 항목이 새로 추가됐습니다. \n현재상태 : todo: ${countTodoStatus("todo")}, doing: ${countTodoStatus("doing")}, done: ${countTodoStatus("done")}`);
        break;

      case "update":
        console.log(`id: ${task.id}, \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. \n현재상태 : todo: ${countTodoStatus("todo")}, doing: ${countTodoStatus("doing")}, done: ${countTodoStatus("done")}`);
        break;

      case "remove":
        console.log(`id: ${task.id}, \"${task.name}\" 삭제완료`);
        break;
    }
  }

  listByTag(todoByTag) {
    Object.keys(todoByTag).forEach(status => {
      if (!todoByTag[status]) return;
      const headMsg = `[ ${status} , 총${todoByTag[status].length}개 ]\n`;
      const resultStr = todoByTag[status].reduce((accStr, task) => accStr += `${this.getMsg(task)}\n`, headMsg);

      console.log(resultStr + "\n");
    });
  }

  listByAllTags(todoByTags) {
    Object.keys(todoByTags).forEach(tag => {
      const headMsg = `[ ${tag} , 총${todoByTags[tag].length}개 ]\n`;
      const resultStr = todoByTags[tag].reduce((accStr, task) => accStr += `${this.getMsg(task)}, [${task.status}]\n`, headMsg);

      console.log(resultStr + "\n");
    });
  }

  listByStatus(list, status) {
    const filteredList = list.filter(task => task.status === status);
    const resultStr = filteredList.reduce((accStr, task) => accStr += `${this.getMsg(task)}, [${task.tag}]\n`, '');

    console.log(resultStr);
  }

  getMsg(task) {
    if (task.spentTime) return `- ${task.id}, ${task.name}, ${this.getTime(task.spentTime)}`
    return `- ${task.id}, ${task.name}`
  }

  listByAllStatus(todoByStatus, list, asynTime) {
    const listLength = list.length;
    const kindOfPrint = Object.keys(todoByStatus);
    const countOfCallback = kindOfPrint.length;
    let asynIndex = 0;

    const asynPrint = status => {
      asynIndex += 1;
      console.log(`[ ${status} , 총${todoByStatus[status].length}개 ]`);
      if (todoByStatus[status].length) todo.show(status);
      if (kindOfPrint[asynIndex]) console.log(`\n\"지금부터 ${asynTime[asynIndex] / 1000}초뒤에 ${kindOfPrint[asynIndex]}내역을 출력합니다....\"`);
      if (asynIndex < countOfCallback) setTimeout(asynPrint, asynTime[asynIndex], kindOfPrint[asynIndex]);
    };

    console.log(`\"총 ${listLength}개의 리스트를 가져왔습니다. ${asynTime[asynIndex] / 1000}초뒤에 ${kindOfPrint[asynIndex]}내역을 출력합니다.....\"`);

    setTimeout(asynPrint, asynTime[asynIndex], kindOfPrint[asynIndex]);
  }

  getTime(spentTime) {
    const days = parseInt(spentTime / 24 / 60 / 60 / 1000);
    spentTime -= days * 24 * 60 * 60 * 1000;
    const hours = parseInt(spentTime / 60 / 60 / 1000);
    spentTime -= hours * 60 * 60 * 1000;
    const mins = parseInt(spentTime / 60 / 1000);
    spentTime -= mins * 60 * 1000;
    const secs = parseInt(spentTime / 1000);

    let timeStr = ``;
    if (days) timeStr += `${days}일 `;
    if (hours) timeStr += `${hours}시간 `;
    if (mins) timeStr += `${mins}분 `;
    if (secs) timeStr += `${secs}초`;

    return timeStr;
  }
}

class TodoObj {
  tag(todoList, tag) {
    const todoObj = { todo: "", doing: "", done: "" };
    todoList
      .filter(task => task.tag === tag)
      .forEach(task => !todoObj[task.status] ? (todoObj[task.status] = [task]) : todoObj[task.status].push(task));

    return todoObj;
  }

  tags(todoList) {
    const todoObj = {};
    todoList
      .filter(task => task.tag)
      .forEach(task => !todoObj[task.tag] ? (todoObj[task.tag] = [task]) : todoObj[task.tag].push(task));

    return todoObj;
  }

  status(todoList) {
    const todoObj = { todo: "", doing: "", done: "" };
    todoList.forEach(task => !todoObj[task.status] ? (todoObj[task.status] = [task]) : todoObj[task.status].push(task));

    return todoObj;
  }
}

class Error {
  inCaseAdd(list, name) {
    const bSameName = list.some(task => task.name === name);
    if (bSameName) {
      console.log(`[error] todo에는 이미 같은 이름의 task가 존재합니다.`);
      return true;
    }
    return false;
  }

  inCaseUpdate(list, targetTask, id, status) {
    // 잘못된 command 입력시 에러 출력
    const commandList = ["todo", "doing", "done"];
    const bRightCommand = commandList.some(command => command === status);
    if (!bRightCommand) {
      console.log(`[error] Todo Command(todo/doing/done)를 잘못 입력하셨습니다`);
      return true;
    }

    const bSameId = this.isExist(list, id);
    if (!bSameId) {
      console.log(`[error] ${id} ID는 존재하지 않습니다.`);
      return true;
    }

    const bSameStatus = targetTask.status !== status;
    if (!bSameStatus) {
      console.log(`[error] ${targetTask.id}는 이미 ${status}입니다.`);
      return true;
    }

    const bSameDone = targetTask.status !== "done";
    if (!bSameDone) {
      console.log(`[error] done 상태에서 ${status}상태로 갈 수 없습니다.`);
      return true;
    }
    return false;
  }

  inCaseRemove(list, id) {
    const bSameId = this.isExist(list, id);
    if (!bSameId) {
      console.log(`[error] ${id} ID는 존재하지 않습니다.`);
      return true;
    }
    return false;
  }

  isExist(list, id) {
    return list.some(task => task.id === id);
  }
}

class Execution {
  constructor() {
    this.record = {
      undoList: [],
      redoList: [],

      copyTargetTask(targetTask) {
        const copyObj = {};
        for (let key in targetTask) {
          if (targetTask.hasOwnProperty(key)) {
            copyObj[key] = targetTask[key];
          }
        }
        return copyObj;
      },

      pushUndoList(methodName, task, nextStatus) {
        const copyedData = this.copyTargetTask(task);
        const record = {
          todoMethod: methodName,
          task: copyedData,
          nextStatus: nextStatus
        };
        if (this.undoList.length >= 3) this.undoList.shift();
        this.undoList.push(record);
      },

      pushRedoList(task) {
        const copyedData = this.copyTargetTask(task);
        const record = {
          todoMethod: copyedData.todoMethod,
          task: copyedData.task,
          nextStatus: copyedData.nextStatus
        };
        if (this.redoList.length >= 3) this.redoList.shift();
        this.redoList.push(record);
      }
    };
  }

  undo(list) {
    const targetUndo = this.record.undoList.pop();
    if (!targetUndo) {
      console.log("undo할 todo가 없습니다");
      return;
    }

    if (targetUndo.todoMethod === "add") {
      const undoTaskIndex = list.findIndex(task => task.id === targetUndo.task.id);
      list.splice(undoTaskIndex, 1);
      this.record.pushRedoList(targetUndo);

      console.log(`\"${targetUndo.task.id}, ${targetUndo.task.name}가 삭제됐습니다\"`);
    }
    else if (targetUndo.todoMethod === "update") {
      const undoTaskIndex = list.findIndex(task => task.id === targetUndo.task.id);
      list[undoTaskIndex] = targetUndo.task;
      this.record.pushRedoList(targetUndo);

      console.log(`\"${targetUndo.task.id}항목이 ${targetUndo.nextStatus} => ${targetUndo.task.status} 상태로 변경됐습니다\"`);
    }
    else if (targetUndo.todoMethod === "remove") {
      list.push(targetUndo.task);
      this.record.pushRedoList(targetUndo);

      console.log(`\"${targetUndo.task.id}항목 \'${targetUndo.task.name}\'가 삭제에서 ${targetUndo.task.status} 상태로 변경됐습니다\"`);
    }
  }

  redo() {
    const targetRedo = this.record.redoList.pop();
    if (!targetRedo) {
      console.log("redo할 todo가 없습니다");
      return;
    }

    if (targetRedo.todoMethod === "add") {
      todo.add({ name: targetRedo.task.name, tag: targetRedo.task.tag });
    }
    else if (targetRedo.todoMethod === "update") {
      todo.update({ id: targetRedo.task.id, nextstatus: targetRedo.nextStatus });
    }
    else if (targetRedo.todoMethod === "remove") {
      todo.remove({ id: targetRedo.task.id });
    }
  }
}

const message = new Message();
const todoObj = new TodoObj();
const error = new Error();
const execution = new Execution();
const todo = new Todo(message, todoObj, error, execution);