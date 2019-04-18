const todos = require("./todos");

const makeNewTodoList = function(todos){
    newTodoList = {'todo' : [], 'doing' : [], 'done' : []};

    todos.forEach(function(todo){
        let key = todo.status;
        let value = todo.name;
        newTodoList[key].push(value);
    })

    return newTodoList;
};

const printAll = function(newTodoList){
    let currentAllStatus = [];
    for(key in newTodoList){
        currentAllStatus.push(key + ": " + newTodoList[key].length + "개");
    }
    console.log("현재상태 : ", currentAllStatus.join(', '));
}

const printStatus = function(args, newTodoList){
    let currentEachStatus = [];

    for(key in newTodoList[args]){
        currentEachStatus.push(newTodoList[args][key]);
    }
    console.log(`${args}리스트 : 총 : `+newTodoList[args].length + "건 : " + currentEachStatus.join(', '));
}

const checkTags = (tag, todos) => {
    let result = [];
    result = todos.filter((todo) => {
        return todo.tags.includes(tag);
    }).map((obj) => { return obj.name });
 
    console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
 };

 let printStatusAfterCheckKwd = function (searchKeyWord, newTodoList) {
    if (searchKeyWord === 'all') {
        printAll(newTodoList);
    } else {
        printStatus(searchKeyWord, newTodoList);
    }
 }

 const show = (keyWord, searchKeyWord) => {
    let newTodoList = makeNewTodoList(todos.todos);
 
    if (keyWord == 'status') {
        printStatusAfterCheckKwd(searchKeyWord, newTodoList);
    } else {
        checkTags(searchKeyWord, todos.todos);
    }
 }

 show("status", "all");
 show("status", "todo");
 show("status", "doing");
 show("status", "done");
 show("tag", "favorite");
 show("tag", "food");
 show("tag", "javascript");