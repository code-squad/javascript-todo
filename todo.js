//todos.js

const todos =  [ 
    {
        'name' : '자바스크립트 공부하기', 
        'tags' : ['programming', 'javascript'],
        'status' : 'todo',
        'id' : 12123123
    },
                    {
        'name' : ' 그림 그리기', 
        'tags' : ['picture', 'favorite'],
        'status' : 'doing',
        'id' : 312323
    },
    {
        'name' : '할게 많다', 
        'tags' : ['programming', 'javascript'],
        'status' : 'todo',
        'id' : 12123143
    }
];

const getRandomInt = ()=> {
    const max = 10000;
    return Math.floor(Math.random() * Math.floor(max));
}

const isIdExistInTodos = (randomInt) => {
    const idCheck = (obj) => obj.id === randomInt;
    return todos.some(idCheck);
} 

const getID = () => {
    let ID = getRandomInt();
    while(isIdExistInTodos(ID)) {
        ID = getRandomInt();
    }
    return ID;
}
// getID()

function init(todos){
    const res = {
    
    };
    for( obj of todos) {
       if(res[obj.status] === undefined) {
           res[obj.status] = [];
           res[obj.status].push(obj);
           continue;
       } 
        res[obj.status].push(obj);      
    } 
    return res;
}

function show(status){
    const arrangedData = init(todos);
    let res; 
    if (status === "all") {
        for (key in arrangedData ) {
            console.log( key, ": ", arrangedData[key].length)
        }
    }
    if (!(arrangedData[status]===undefined)) {
        res = arrangedData[status].map(v => v.name);
        console.log(res.join(", "));
    }
}

const add = (inputName, inputTag) => {
    const todo = {};
    todo.name = inputName;
    if(!inputTag === undefined) todo.tag = inputTag;
    todo.status = "todo";
    todo.id = getID();
    todos.push(todo);
    console.log(`${todo.name} 이 1개가 추가되었습니다`)
    setTimeout(() => {
        show("all"); 
        rl.prompt();
    } ,1000)
}

// add("할일없음");
const deleteTodo = (id) => {
    let todo2delete;
    todos.forEach((todo) => {
        if(todo.id === Number(id)) todo2delete = todos.pop(todo);
    });
    console.log(`${todo2delete.name} ${todo2delete.status} 가 목록에서 삭제됐습니다.`)
    setTimeout(() => {
        show("all");
        rl.prompt();
    },1000)
}

const update = (id, inputStatus) => {
    let todo2update;
    todos.forEach((todo) => {
        if(todo.id === Number(id)) {
            todos.status = inputStatus; 
            todo2update = todo;
        }
    });
    setTimeout(() => {
        console.log(`${todo2update.name} 가 ${todo2update.status}(으)로 변경되었습니다.`);
        setTimeout(()=> {
            show("all")
            rl.prompt();
        }, 1000)

    },3000)
    
}

const readline=require("readline");
 
const rl=readline.createInterface({
  input:process.stdin,
  output:process.stdout,
  prompt: "명령하세요: "
});

const parseInput = input => input.split("$");


rl.prompt();
rl.on("line",(data)=>{
    const input = parseInput(data);
    switch (input[0]) {
        case "add" : add(input[1], input[2]);
        break;
        case "update" : update(input[1], input[2]);
        break;
        case "delete": deleteTodo(input[1]);
        break;
    }    
});
