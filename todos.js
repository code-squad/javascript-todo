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
 
 let newTodoObject;
 
 const makeNewTodoList = () => {
    todos.forEach(todo => {
        let key = todo.status;
        let value = todo.name;
        newTodoObject[key].push(value);
    })
 };
 
 const printAll = () => {
    let result = [];
    for(key in newTodoObject){
        result.push(key + ": " + newTodoObject[key].length + "개");
    }
    console.log("현재상태 : ", result.join(', '));
 }
 
 const printStatus = (args) => {
    let result = [];
 
    for(key in newTodoObject[args]){
        result.push(newTodoObject[args][key]);
    }
    console.log(`${args}리스트 : 총 :` +newTodoObject[args].length + "건 : " + result.join(', '));
 }
 
 const checkTags = (tag) => {
    let result = [];
    todos.forEach((list) => {
        if (list.tags.includes(tag)) {
            result.push(list.name);
        }
    })
 
    console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
 };
 
 let printStatusAfterCheckKwd = (searchKeyWord) => {
    if (searchKeyWord === 'all') {
        printAll();
    } else {
        printStatus(searchKeyWord);
    }
 }
 
 const show = (keyWord, searchKeyWord) => {
    newTodoObject = {'todo' : [], 'doing' : [], 'done' : []};
    makeNewTodoList();
 
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