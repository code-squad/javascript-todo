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

let newTodoList;

const makeNewTodoList = function(){
    todos.forEach(function(todo){
        let key = todo.status;
        let value = todo.name;
        newTodoList[key].push(value);
    })
};

const printAll = function(){
    let result = [];
    for(key in newTodoList){
        result.push(key + ": " + newTodoList[key].length + "개");
    }
    console.log("현재상태 : ", result.join(', '));
}

const printStatus = function(args){
    let result = [];

    for(key in newTodoList[args]){
        result.push(newTodoList[args][key]);
    }
    console.log(`${args}리스트 : 총 : `+newTodoList[args].length + "건 : " + result.join(', '));
}

const checkTags = function(tag){
    let result = [];
    todos.forEach(function(list){
        if (list.tags.includes(tag)) {
            result.push(list.name);
        }
    })
 
    console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
 };

 let printStatusAfterCheckKwd = function (searchKeyWord) {
    if (searchKeyWord === 'all') {
        printAll();
    } else {
        printStatus(searchKeyWord);
    }
 }

const show = (obj) => {
    newTodoList = {'todo' : [], 'doing' : [], 'done' : []};
    makeNewTodoList();

    if (obj === "all") {
        printAll();
    } else {
        printStatus(obj);
    }
}

show("all");
show("todo");
show("doing");
show("done");