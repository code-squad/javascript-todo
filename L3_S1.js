// lecture3 - STEP1. 기본기능 구현

class todoProgram {

  // 변수 생성하기
  constructor() {
    this.task = [];
    this.id = 1;
  }

  // 한줄띄어쓰는 함수
  newline() {
    console.log(``);
  }

  // 현재상태를 출력하는 함수
  printNow() {
    this.doneCount = 0;
    this.doingCount = 0;
    this.todoCount = 0;
    for (let keys of this.task) {
      const { status } = keys;
      if (status === 'todo') this.todoCount++;
      if (status === 'doing') this.doingCount++;
      if (status === 'done') this.doneCount++;
    }
    console.log(`현재상태 : todo:${this.todoCount}개,  doing:${this.doingCount}개, done:${this.doneCount}개`);
  }

  // 변경사항을 출력하는 함수
  printUpdate(id, name, situation) {
    console.log(`id: ${id},  "${name}" ${situation}`);
  };

  // 새로운 항목을 추가하는 함수
  add({ name, tag }) {
    this.task.push({
      name: name,
      tag: tag,
      id: this.id,
      status: 'todo'
    })
    this.printUpdate(this.id, name, '항목이 새로 추가됐습니다.');
    this.printNow();
    this.id++;
    this.newline();
  }

  // 현재상태를 갱신 하는 함수
  update(nowStatus) {
    let oldStatus;
    let newStatus = nowStatus.nextstatus.toLowerCase();
    let name;

    for (let keys of this.task) {
      if (keys.id === nowStatus.id) {
        name = keys.name;
        oldStatus = keys.status;
        keys.status = newStatus;
      }
    }
    this.printUpdate(nowStatus.id, name, `항목이 ${oldStatus} => ${newStatus} 상태로 업데이트 됐습니다.`);
    this.printNow();
    this.newline();
  }

  // 기존 항목을 삭제하는 함수
  remove(existing) {
    let existingLecture;
    for (let keys of this.task) {
      if (keys.id === existing.id) {
        existingLecture = keys;
        this.task.splice(this.task.indexOf(keys), 1);
      }
    }
    this.printUpdate(existingLecture.id, existingLecture.name, '삭제완료.');
    this.printNow();
    this.newline();
  }
}

const todo = new todoProgram();
// todo.add({name: "쉬기", tag:"rest"});
// todo.update({id:1,  nextstatus:"dOing"});
// todo.update({id:1,  nextstatus:"Done"});
// todo.add({name: "놀기", tag:"rest"});
// todo.update({id:2,  nextstatus:"dOing"});
// todo.update({id:2,  nextstatus:"Done"});
// todo.remove({id:1});
// todo.remove({id:2});