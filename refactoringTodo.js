const todos = [
    {
      name: "자바스크립트 공부하기",
      tags: ["programming", "javascript"],
      status: "todo",
      id: 12123123
    },
    {
      name: "그림 그리기",
      tags: ["picture", "favorite"],
      status: "doing",
      id: 312323
    },
    {
      name: "라면 끓여먹기",
      tags: ["food", "favorite"],
      status: "doing",
      id: 1541515132
    },
    {
      name: "칼퇴하기",
      tags: ["wolibal", "favorite"],
      status: "todo",
      id: 15132213251
    },
    {
      name: "알고리즘풀기",
      tags: ["study", "hell"],
      status: "done",
      id: 123123312323
    },
    {
      name: "운동하기",
      tags: ["workout", "hell"],
      status: "todo",
      id: 3121234323
    }
  ];
  
  class TodoList {
    constructor() {
      this.status = {
        TODO: 0,
        DOING: 1,
        DONE: 2
      };
    }
    count() {
      const arr = [0, 0, 0];
      todos.forEach(element => {
        const { status } = element;
        if (status === "todo") arr[this.status.TODO] += 1;
        else if (status === "doing") arr[this.status.DOING] += 1;
        else if (status === "done") arr[this.status.DONE] += 1;
      });
      return arr;
    }
  
    printAll(countArr) {
      let resultStr;
      resultStr = `현재상태 : todo : ${countArr[this.status.TODO]}개, doing : ${
        countArr[this.status.DOING]
      }, done : ${countArr[this.status.DONE]}`;
      console.log(resultStr);
    }
  
    getNames(status) {
      const namesArr = [];
      todos.forEach(element => {
        if (status === element.status) namesArr.push(element.name);
      });
      return namesArr;
    }
  
    printList(namesArr, status) {
      let resultStr = `${status} 리스트 : 총 ${namesArr.length}건 : `;
      namesArr.forEach(function(element, index) {
        resultStr += `'${element}'`;
        if (index < namesArr.length - 1) {
          resultStr += `, `;
        }
      });
      console.log(resultStr);
    }
  
    show(status) {
      if (status === "all") {
        const countArr = this.count();
        this.printAll(countArr);
      } else if (status === "todo" || status === "doing" || status === "done") {
        const namesArr = this.getNames(status);
        this.printList(namesArr);
      } else {
        throw Error("show의 인자는 todo, doing, done, all 만 가능합니다!");
      }
    }
  }
  
  const myTodo = new TodoList();
  myTodo.show("all");
  myTodo.show("todo");
  myTodo.show("doing");
  myTodo.show("done");
  myTodo.show("too");