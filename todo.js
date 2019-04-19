const { log } = console;
const todos = [
  {
    name: "자바스크립트 공부하기",
    tags: ["programming", "javascript"],
    status: "todo",
    id: 423
  },
  {
    name: "그림 그리기",
    tags: ["picture", "favorite"],
    status: "doing",
    id: 1535
  },
  {
    name: "라면 끓여먹기",
    tags: ["food", "favorite"],
    status: "doing",
    id: 9999
  },
  {
    name: "칼퇴하기",
    tags: ["wolibal", "favorite"],
    status: "todo",
    id: 512
  },
  {
    name: "알고리즘풀기",
    tags: ["study", "hell"],
    status: "done",
    id: 2
  },
  {
    name: "운동하기",
    tags: ["workout", "hell"],
    status: "todo",
    id: 77
  }
];

const MAX_ID_NUMBER = 10000;


const getRandomId = maxIdNumber => {
  let id;
  let loopCount = 0;
  while (true) {

    id = Math.floor(Math.random() * maxIdNumber) + 1;
    if (todos.filter(element => element.id === id).length === 0) break;
    if (++loopCount > MAX_ID_NUMBER) throw Error("할일 목록이 가득 찼습니다.");

  }
  return id;
}

const getMatchResult = (string ,regExp) => string.match(regExp);

const MSG = {
  SHOW_PARAM_ERR : `show 명령어 인자가 잘못 되었습니다.`,
  ADD_PARAM_NAME_ERR : `add 명령어의 인자 name이 잘못 되었습니다.`,
  ADD_PARAM_TAG_ERR : `add 명령어의 인자 tag형태가 잘못 되었습니다. example: ["tagname"]`,
  DELETE_PARAM_ERR : `delete명령어의 인자가 잘못 되었습니다.`,
  UPDATE_PARAM_ERR : `update명령어의 인자가 잘못 되었습니다.`
}

module.exports = class TodoList {
  count() {
    const countObj = {
      todo: 0,
      doing: 0,
      done: 0
    }
    todos.forEach(element => {
      const { status } = element;
      countObj[status] += 1;
    });
    return countObj;
  }

  printAll(countObj) {
    let resultStr;
    resultStr = `현재상태 : todo : ${countObj.todo}개, doing : ${
      countObj.doing
      }개, done : ${countObj.done}개`;
    log(resultStr);
  }
  getNames(status) {
    const namesArr = todos
      .filter(element => status === element.status)
      .map(element => element.name);
    return namesArr;
  }
  printList(namesArr, status) {
    let baseStr = `${status} 리스트 : 총 ${namesArr.length}건 : `;
    let resultStr = namesArr.reduce((accumulator, currentName) => {
      if(baseStr === accumulator){
        return accumulator + currentName;
      }else{
        return accumulator +" , "+currentName;
      }
    }, baseStr);
    log(resultStr);
  }
  
  showData(status) {
    const statusReg = /^all$|^todo$|^doing$|^done$/;
    const matchResult = getMatchResult(`${status}`,statusReg);
    if (matchResult === null) {
      log(MSG.SHOW_PARAM_ERR);
      return;
    }

    if (matchResult[0] === 'all') {
      const countObj = this.count();
      this.printAll(countObj);
    } else {
      const namesArr = this.getNames(status);
      this.printList(namesArr, status);
    }
  }

  addData(name, tags) {
    const nameReg = /^\s+$/;
    const tagsReg = /^\[\"\S+\"\]$/;
    const nameMatchResult = getMatchResult(`${name}`,nameReg);
    const tagsMatchResult = getMatchResult(`${tags}`,tagsReg);

    if (nameMatchResult !== null || name === "") {
      log(MSG.ADD_PARAM_NAME_ERR);
      return;
    }
    if (tagsMatchResult === null) {
      log(MSG.ADD_PARAM_TAG_ERR);
      return;
    }
    const id = getRandomId(MAX_ID_NUMBER);

    const todoObj = {
      "name": name,
      "tags": tags,
      "status": "todo",
      "id": id
    }
    todos.push(todoObj);
    log(`${name} 1개가 추가됐습니다.(id : ${id})`);
    setTimeout(() => {
      this.showData("all");
    }, 1000);
  }

  //여기는 filter & reduce 같은 메서드로 수정할까요? (검토해보세요)
  deleteData(id) {
    const numId = parseInt(id);
    if (!Number.isFinite(numId)) {
      log(MSG.DELETE_PARAM_ERR);
      return;
    }
    let deletingObj;
    // todos.filter(element => element.id === numId);

    todos.forEach((element, index) => {
      if (element.id === numId) {
        deletingObj = element;
        todos.splice(index, 1);
      }
    });

    log(`${deletingObj.name}이(가) ${deletingObj.status} 목록에서 삭제됐습니다.`);
    setTimeout(() => {
      this.showData("all");
    }, 1000);
  };

  updateData(id, status) {
    const statusReg = /^todo$|^doing$|^done$/;
    const matchResult = getMatchResult(`${status}`,statusReg);
    const numId = parseInt(id);
    if (!Number.isFinite(numId) || matchResult === null) {
      log(MSG.UPDATE_PARAM_ERR);
      return;
    }
    let name;
    todos.forEach(element => {
      if (element.id === numId) {
        element.status = status;
        name = element.name;
      }
    });

    setTimeout(() => {
      log(`${name}이(가) ${status}로 상태가 변경됐습니다.`)
      setTimeout(() => {
        this.showData("all");
      }, 1000);
    }, 3000);
  }
}

