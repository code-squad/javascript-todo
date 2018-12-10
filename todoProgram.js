// lecture3 - STEP3. 사용성향상
class todoProgram {

  constructor() { // 변수 생성하기
    this.historyList = [];
    this.undoList = [];
    this.taskList = [];
    this.id = 1;
    this.status = ['todo', 'doing', 'done'];
    this.undoCount = 1;
    this.redoCount = 1;
  }

  newLine() { // 한줄띄어쓰기
    console.log(``);
  }

  startTime() { // 시작하는 시간을 가져옴
    return new Date().getTime();
  }

  overTime(startTime) { // 끝나는 시간에서 시작하는 시간을 뺌
    return new Date().getTime() - startTime;
  }

  printError(Case, status, id) {
    switch (Case) {
      case 'existStatus':
        console.log(`[error] ${status}에는 이미 같은 이름의 task가 존재합니다.`);
        break;
      case 'sameStatus':
        console.log(`[error] ${id}번은 이미 ${status}입니다.`);
        break;
      case 'alreadyDone':
        console.log(`[error] done 상태에서 ${status}상태로 갈 수 없습니다.`);
        break;
      case 'dontExistId':
        console.log(`[error] ${id}번 아이디는 존재하지 않습니다.`);
        break;
    }
  }

  addError(newTaskName) { // 같은 task가 존재하면 true 않으면 false 반환
    for (let task of this.taskList) {
      const { name } = task;
      if (name === newTaskName) {
        this.printError('existStatus', task.status);
        return true;
      }
      return false;
    }
  }

  updateError(newId, newStatus, undo) {
    for (let task of this.taskList) {
      const { id, status } = task;
      if (id === newId) {
        if (status === newStatus) {
          this.printError('sameStatus', newStatus, newId);
          return true;
        }
        if (status === 'done' && newStatus !== 'done') {
          if (undo === undefined) {
            this.printError('alreadyDone', newStatus);
            return true;
          }
        }
        return false;
      }
    }
    this.printError('dontExistId', null, newId);
    return true;
  }

  removeError(newId) { // 같은 id가 존재하면 false 않으면 true 반환
    for (let task of this.taskList) {
      const { id } = task;
      if (id === newId) return false;
    }
    this.printError('dontExistId', null, newId);
    return true;
  }

  printStatus() { // 현재상태를 출력
    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;
    for (let task of this.taskList) {
      const { status } = task;
      if (status === 'todo') todoCount++;
      if (status === 'doing') doingCount++;
      if (status === 'done') doneCount++;
    }
    console.log(`현재상태 : todo:${todoCount}개,  doing:${doingCount}개, done:${doneCount}개`);
  }

  printUpdate(id, name, situation) { // 변경사항을 출력
    console.log(`id: ${id},  "${name}" ${situation}`);
  }

  assortHistory(undo, history) {
    if (undo === 'undo') this.pushHistory(history, 'undo');
    if (undo === undefined) this.pushHistory(history, 'history');
  }

  add({ name, tag, historyId, status }, undo) { // 새로운 항목을 추가
    if (this.addError(name)) return this.newLine();
    let newTask = {
      name: name,
      tag: tag,
      id: this.id,
      status: 'todo'
    }
    if (historyId !== undefined) {
      newTask.id = historyId;
      newTask.status = status;
    }
    this.taskList.push(newTask);
    this.printUpdate(newTask.id, name, '항목이 새로 추가됐습니다.');
    this.printStatus();
    this.newLine();
    this.assortHistory(undo, { id: newTask.id, method: 'add' });
    this.id++;
  }

  check$(newTask) {
    if (typeof newTask === 'string') {
      newTask = newTask.split('$');
      return {
        id: parseInt(newTask[0], 10),
        nextstatus: newTask[1]
      }
    }
    return newTask;
  }

  update(newTask, undo) { // 현재상태를 갱신
    newTask = this.check$(newTask);
    newTask.nextstatus = newTask.nextstatus.toLowerCase();
    let taskName;
    let oldTask = {
      id: newTask.id,
      status: undefined,
    }
    if (this.updateError(newTask.id, newTask.nextstatus, undo)) return this.newLine();
    for (let task of this.taskList) {
      if (task.id === newTask.id) {
        taskName = task.name;
        oldTask.status = task.status;
        task.status = newTask.nextstatus;
        if (task.status === 'doing') task.startTime = this.startTime();
        if (task.status === 'done') task.overTime = this.overTime(task.startTime);
      }
    }
    this.printUpdate(newTask.id, taskName, `항목이 ${oldTask.status} => ${newTask.nextstatus} 상태로 업데이트 됐습니다.`);
    this.printStatus();
    this.newLine();
    this.assortHistory(undo, { id: oldTask.id, status: oldTask.status, method: 'update' });
  }

  remove(existing, undo) { // 기존 항목을 삭제
    if (this.removeError(existing.id)) return this.newLine();
    let existingLecture;
    for (let task of this.taskList) {
      if (task.id === existing.id) {
        existingLecture = task;
        this.taskList.splice(this.taskList.indexOf(task), 1);
      }
    }
    this.printUpdate(existingLecture.id, existingLecture.name, '삭제완료.');
    this.printStatus();
    this.newLine();
    this.assortHistory(undo, { name: existingLecture.name, tag: existingLecture.tag, id: existingLecture.id, status: existingLecture.status, method: 'remove' });
  }

  printTasks(status, taskCount, statusArr, overTime) { // 호출하는 할일들을 출력
    console.log(`[ ${status} , 총${taskCount}개 ]`);
    for (let i = 0; i < taskCount; i++) process.stdout.write(`- ${statusArr[i].id}번, ${statusArr[i].name}`);
    if (status === 'done') console.log(`, ${overTime} ms`);
    this.newLine();
  }

  showTag(tag) { // 태그를 입력 받아 태그와 일치하는 할일을 모두 출력
    const sortTaskArr = [[], [], []]; // todo, doing, done
    let overTime;
    for (let task of this.taskList) {
      if (task.tag === tag) {
        switch (task.status) {
          case 'todo':
            sortTaskArr[0].push(task);
            break;
          case 'doing':
            sortTaskArr[1].push(task);
            break;
          case 'done':
            sortTaskArr[2].push(task);
            overTime = task.overTime;
            break;
        }
      }
    }
    for (let i = 0; i < 3; i++) this.printTasks(this.status[i], sortTaskArr[i].length, sortTaskArr[i], overTime);
  }

  pushTasks(tagsArray, sortTask) { // 태그가 맞으면 sortTask의 맞는 인덱스에 push
    this.taskList.forEach(function (task) {
      let tagBool = tagsArray.indexOf(task.tag);
      if (tagBool !== -1) {
        sortTask[tagBool].push(task);
      }
    });
  }

  showTags() { // 태그가 있는 모든 할일을 tag기준으로 출력
    let tagsArray = [];
    let sortTask = [];
    this.findTags(tagsArray, sortTask);
    this.pushTasks(tagsArray, sortTask);
    for (let i = 0; i < tagsArray.length; i++) {
      console.log(`[ ${tagsArray[i]} , 총${sortTask[i].length}개 ]`);
      for (let j = 0; j < sortTask[i].length; j++) {
        process.stdout.write(`- ${sortTask[i][j].id}번, ${sortTask[i][j].name}, [${sortTask[i][j].status}]`);
        if (sortTask[i][j].status === 'done') console.log(` ${sortTask[i][j].overTime} ms`);
        else console.log('');
      }
      this.newLine();
    }
  }

  show(status, call, taskCount) { // staus를 입력받아 해당하는 할일을 모두 출력
    let LowerCaseStatus = status.toLowerCase();
    if (call === 'status') console.log(`[ ${status} , 총${taskCount}개 ]`);
    for (let task of this.taskList) {
      if (task.status === LowerCaseStatus) {
        process.stdout.write(`- ${task.id}번, ${task.name}, [${task.tag}]`);
        if (status === 'done') console.log(` ${task.overTime} ms`);
        else console.log('');
      }
    }
    this.newLine();
  }

  printShowAll(status, allTaskCount, delayTime) { // 지연할 시간과 총 리스트의 개수, status를 출력
    if (status === 'todo') return console.log(`"총 ${allTaskCount}개의 리스트를 가져왔습니다. ${delayTime}초뒤에 ${status}내역을 출력합니다....."`);
    else console.log(`"지금부터 ${delayTime}초뒤에 ${status}내역을 출력합니다...."`);
  }

  taskCountFuc(status) { // status가 일치하는 task의 개수를 카운트
    let taskCount = 0;
    for (let task of this.taskList) {
      if (task.status === status) {
        taskCount++;
      }
    }
    return taskCount;
  }

  showAll() { // 모든 리스트를 상태를 기준으로 지연출력
    let i = 0;
    let delayTime = [2, 3, 2];
    let recursion = (i) => {
      let taskCount = this.taskCountFuc(this.status[i]);
      if (i > 2) return;
      this.show(this.status[i], 'status', taskCount);
      i++;
      if (this.status[i] !== undefined) this.printShowAll(this.status[i], this.taskList.length, delayTime[i]);
      setTimeout(() => recursion(i), 1000 * delayTime[i]);
    }
    this.printShowAll(this.status[i], this.taskList.length, delayTime[i]);
    setTimeout(() => recursion(i), 1000 * delayTime[i]);
  }

  pushHistory(copyTask, doType) {
    switch (doType) {
      case 'history':
        this.historyList.push(copyTask);
        this.redoCount = 1;
        break;
      case 'undo':
        this.undoList.push(copyTask);
        break;
    }
  }

  undoError(undo) { // undo, redo를 3번 초과 실행 했을때 에러 메세지를 출력
    switch (undo) {
      case 'undo':
        if (this.undoCount >= 4) {
          console.log(`${undo}는 3번만 할 수 있습니다.`);
          return true;
        }
        break;
      case 'redo':
        if (this.redoCount >= 4) {
          console.log(`${undo}는 3번만 할 수 있습니다.`);
          return true;
        }
        break;
    }
    return false;
  }

  undoRun(list, count, undo) {
    const history = list[list.length - count];
    switch (history.method) {
      case 'add':
        this.remove({ id: history.id }, undo);
        break;
      case 'remove':
        this.add({ name: history.name, tag: history.tag, historyId: history.id, status: history.status }, undo);
        break;
      case 'update':
        this.update({ id: history.id, nextstatus: history.status }, undo);
        break;
    }
  }

  undo() { // 실행했던 함수를 취소
    if (this.undoError('undo')) return this.newLine();
    this.undoRun(this.historyList, this.undoCount, 'undo');
    this.undoCount++;
  }

  redo() { // 최소한 함수를 다시 실행
    if (this.undoError('redo')) return this.newLine();
    this.undoRun(this.undoList, this.redoCount, 'redo');
    this.undoCount--;
    this.redoCount++;
  }
}



const todo = new todoProgram();
todo.add({ name: "자바스크립트 공부안하기", tag: "programming" });
todo.add({ name: "자바스크립트 공부안하기", tag: "programming" });
todo.undo();
todo.redo();
todo.update("1$done");
todo.update('1$done');
todo.update("1$doing");
todo.update('9$doing');
todo.remove({id:8});

todo.show('todo');
todo.show('doing');
todo.show("done");  