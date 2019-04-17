const todos =  [ 
    {
        'name' : '자바스크립트 공부하기', 
        'tags' : ['programming', 'javascript'],
        'status' : 'todo',
        'id' : 12123123
    },
    {
        'name' : '그림 그리기', 
        'tags' : ['picture', 'favorite'],
        'status' : 'doing',
        'id' : 35435345
    },
    {
        'name' : '꽃구경하기', 
        'tags' : ['flower', 'favorite'],
        'status' : 'done',
        'id' : 7657
    },
    {
        'name' : '저녁식사', 
        'tags' : ['dinner', 'food'],
        'status' : 'todo',
        'id' : 097989
    },
    {
        'name' : '커피마시기', 
        'tags' : ['coffee', 'favorite'],
        'status' : 'doing',
        'id' : 65464
    }
];
const makeNewTodoList = () => {
    let newTodoObject = {'todo' : [], 'doing' : [], 'done' : []};;
    todos.forEach(todo => {
        let key = todo.status;
        let value = todo.name;
        newTodoObject[key].push(value);
    });
    return newTodoObject;
};
const printAll = (newTodoObject) => {
    let result = [];
    for(key in newTodoObject){
        result.push(key + ": " + newTodoObject[key].length + "개");
    }
    console.log("현재상태 : ", result.join(', '));
}
const printStatus = (args, newTodoObject) => {
    let result = [];
    for(key in newTodoObject[args]){
        result.push(newTodoObject[args][key]);
    }
    console.log(`${args}리스트 : 총 : `+newTodoObject[args].length + "건 : " + result.join(', '));
}
const checkTags = (tag) => {
    let result = [];
    result = todos.filter((todo) => {
        return todo.tags.includes(tag);
    }).map((obj) => { return obj.name });
 
    console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
 };
 let printStatusAfterCheckKwd = (searchKeyWord) => {
    let newTodoObject = makeNewTodoList();
    if (searchKeyWord === 'all') {
        printAll(newTodoObject);
    } else {
        printStatus(searchKeyWord, newTodoObject);
    }
 }
 const show = (keyWord, searchKeyWord) => {
    if (keyWord == 'status') {
        printStatusAfterCheckKwd(searchKeyWord);
    } else {
        checkTags(searchKeyWord);
    }
 }
 show("status", "all");
 show("status", "todo");
 show("status", "doing");
 show("status", "done");
 show("tag", "favorite");
 show("tag", "food");
 show("tag", "javascript");