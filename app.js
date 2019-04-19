const readline = require('readline');
const todo = require('./todo.js');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todoObjectTemplate = {
    name: "",
    category: "",
    status: "",
    id: "",
    deadline: "",
};

const getHashCode = function (inputArg) {
    return Math.abs((inputArg + Date.now()).split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
};

const syncronizecDatabase = function () {
    const fs = require('fs');
    let syncData = JSON.stringify(todo.database, null, 2);
    fs.writeFile('./database.json', syncData, (err) => {
        if (err) throw err;
    });
};

const addTodo = function (...arg) {
    argKey = arg[0].split(",");
    argValue = arg[1].split(",");
    if (argKey.length !== argValue.length) throw new Error("키와 값의 갯수가 맍지 않습니다.");
    const addToObj = todoObjectTemplate;
    for (let i = 0; i < argKey.length; i++) {
        addToObj[argKey[i]] = argValue[i];
    }
    addToObj.id = getHashCode(arg[1][0]);
    todo.database.push(addToObj);
    syncronizecDatabase();
    console.log(`${addToObj.id}가 추가되었습니다.`);
}

const updateTodo = function (objId, objPorp, objValue) {
    todo.database.forEach((v, i) => {
        if (v.id == objId) {
            v[objPorp] = objValue;
            console.log(`${v.id}의 ${objPorp}가 ${objValue}로 변경되었습니다.`);
        }
    });
    syncronizecDatabase();
}

const deleteTodo = function (objId) {
    todo.database.forEach((v, i) => {
        if (v.id == objId) {
            console.log(`id: ${v.id}, name: ${v.name}이 삭제되었습니다.`);
            todo.database.splice(i, 1);
        }
    });
    syncronizecDatabase();
};

const showTodo = function (...arg) {
    if (arg[0] === "all") {
        todo.show('all');
    } else {
        todo.show(arg[0], arg[1]);
    }
};

const parseCommand = function (inputArg) {
    [commandArg, ...deliveryArg] = inputArg.split("$");
    COMM_DICT[commandArg](...deliveryArg);
    todo.show('all');
};

const COMM_DICT = {
    show: showTodo,
    add: addTodo,
    update: updateTodo,
    delete: deleteTodo
};
rl.on('line', (input) => {
    if (input === "exit") {
        rl.close();
    } else {
        parseCommand(input);
    }
});
