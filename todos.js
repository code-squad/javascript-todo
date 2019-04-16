const todos = require('./data');

let newTodoObject;

class Todo {
  constructor(todos) {
    this.customTodos = todos.reduce(
      (acc, cur) => {
        acc[cur.status].push(cur.name);
        return acc;
      },
      { todo: [], doing: [], done: [] }
    );
  }

  printAll() {
    console.log(
      Object.entries(this.customTodos).reduce((acc, cur) => {
        return (acc += `${cur[0]}: ${cur[1].length}개 `);
      }, '현재상태 : ')
    );
  }
}

//  const printStatus = (args) => {
//     let result = [];

//     for(key in newTodoObject[args]){
//         result.push(newTodoObject[args][key]);
//     }
//     console.log(`${args}리스트 : 총 :` +newTodoObject[args].length + "건 : " + result.join(', '));
//  }

//  const checkTags = (tag) => {
//     let result = [];
//     result = todos.filter((todo) => {
//         return todo.tags.includes(tag);
//     }).map((obj) => { return obj.name });

//     console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
//  };

//  let printStatusAfterCheckKwd = (searchKeyWord) => {
//     if (searchKeyWord === 'all') {
//
//         printAll();
//     } else {
//         printStatus(searchKeyWord);
//     }
//  }

const show = (keyWord, searchKeyWord) => {
  newTodoObject = { todo: [], doing: [], done: [] };
  printAll();
  // if (keyWord === 'status') {
  //printStatusAfterCheckKwd(searchKeyWord);
  // } else {
  // checkTags(searchKeyWord);
  // }
};

const todo = new Todo(todos);
todo.printAll();
// show('status', 'all');
//  show("status", "todo");
//  show("status", "doing");
//  show("status", "done");
//  show("tag", "favorite");
//  show("tag", "food");
//  show("tag", "javascript");
