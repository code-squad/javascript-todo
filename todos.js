const todos = require('./data');

let newTodoObject;

const makeNewTodoList = () => {
  todos.forEach(todo => {
    let key = todo.status;
    let value = todo.name;
    newTodoObject[key].push(value);
  });
};

const printAll = () => {
  let result = [];
  for (key in newTodoObject) {
    result.push(key + ': ' + newTodoObject[key].length + '개');
  }
  console.log('현재상태 : ', result.join(', '));
};

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
  makeNewTodoList();
  printAll();
  // if (keyWord === 'status') {
  //printStatusAfterCheckKwd(searchKeyWord);
  // } else {
  // checkTags(searchKeyWord);
  // }
};

show('status', 'all');
//  show("status", "todo");
//  show("status", "doing");
//  show("status", "done");
//  show("tag", "favorite");
//  show("tag", "food");
//  show("tag", "javascript");
