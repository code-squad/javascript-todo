const makenewTodoObject = function (todos) {
    const newTodoObject = { 'todo': [], 'doing': [], 'done': [] };

    todos.forEach(function (todo) {
        const key = todo.status;
        const value = todo.name;
        newTodoObject[key].push(value);
    })

    return newTodoObject;
};

const printAll = function (newTodoObject, todos) {
    const currentAllStatus = [];
    for (key in newTodoObject) {
        currentAllStatus.push(key + ": " + newTodoObject[key].length + "개");
    }

    setTimeout(() => {
        console.log("현재상태 : ", currentAllStatus.join(', '));
        runTodoProgram(todos);
    }, 1000);
}

const printStatus = function (args, newTodoObject, todos) {
    const currentEachStatus = [];

    for (key in newTodoObject[args]) {
        currentEachStatus.push(newTodoObject[args][key]);
    }

    console.log(`${args}리스트 : 총 : ` + newTodoObject[args].length + "건 : " + currentEachStatus.join(', '));
    checkOrder("show$status$all", todos);
}

const checkTags = (tag, todos) => {
    const result = todos.filter((todo) => {
        return todo.tags.includes(tag);
    }).map((obj) => { return obj.name });

    console.log(`${tag} 키워드 검색 결과 :` + result.join(', '));
    checkOrder("show$status$all", todos);
};

const printStatusAfterCheckKwd = function (searchKeyWord, newTodoObject, todos) {
    if (searchKeyWord === 'all') {
        printAll(newTodoObject, todos);
    } else {
        printStatus(searchKeyWord, newTodoObject, todos);
    }
};

const show = (keyWord, searchKeyWord, todos) => {
    const newTodoObject = makenewTodoObject(todos);
 
    if (keyWord === 'status') {
        printStatusAfterCheckKwd(searchKeyWord, newTodoObject, todos);
    } else {
        checkTags(searchKeyWord, todos);
    }
};


const makeUI = () => {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const inputOrder = (todos) => {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt('\n> 명령을 입력하세요 : ');
    rl.prompt();
    rl.on('line', function (answer) {
        if (answer === 'end') {
            rl.close();
            rl.on('close', function () {
                process.exit();
            });
        }

        rl.setPrompt();
        checkOrder(answer, todos);
        rl.close();
    });
}

const checkOrder = (order, todos) => {
    const splitedOrder = order.split('$');

    switch (splitedOrder[0]) {
        case "add": addTodo(splitedOrder, todos); break;
        case "update": updateTodo(splitedOrder, todos); break;
        case "delete": deleteTodo(splitedOrder, todos); break;
        // show$[status, tag]$[all,todo,tagname]
        case "show": show(splitedOrder[1], splitedOrder[2], todos); break;
        case "showList": showList(todos); break;
    }
}

const showList = (todos) => {
    console.log(todos);
    checkOrder("show$status$all", todos);
}

const addTodo = (args, todos) => {
    // add$CS 공부하기$코드스쿼드,CS
    todo = {
        'name': args[1],
        'tags': args[2].split(","),
        'status': 'todo',
        'id': makeUI()
    };

    todos.push(todo);

    console.log(`${args[1]} 1개가 추가되었습니다.`);

    checkOrder("show$status$all", todos);
}

const updateTodo = (args, todos) => {
    // update$id$name$tags$status
    for (todo of todos) {
        if (todo.id === Number(args[1])) {
            if (args[2] !== 'nc') {
                console.log(`${todo.name}가 ${args[2]}로 변경되었습니다.`);
                todo.name = args[2];
            }

            if (args[3] !== 'nc') {
                console.log(`${todo.tags}가 ${args[3]}로 변경되었습니다.`);
                todo.tags = args[3];
            }

            if (args[4] !== 'nc') {
                console.log(`${todo.status}가 ${args[4]}로 변경되었습니다.`);
                todo.status = args[4];
            }
        }
    }

    setTimeout(() => {
        console.log(todos);
    }, 3000);

    checkOrder("show$status$all", todos);
}

const deleteTodo = (args, todos) => {
    for (key in todos) {
        if (todos[key].id === Number(args[1])) {
            console.log(`${todos[key].name} ${todos[key].status}가 목록에서 삭제됐습니다.`)
            todos.splice(key, 1);
        }
    }

    checkOrder("show$status$all", todos);
}

const runTodoProgram = (todos) => {
    inputOrder(todos);
}

runTodoProgram(require("./todos").todos);
