const database = require('./database.json');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const message = require('./message');

const todo_cli_interface = {

    todoObjectTemplate: {
        name: "",
        category: "",
        status: "",
        id: "",
        deadline: "",
    },


    showCurrentStatus: function () {
        const resultObj = database.map(el => el.status)
            .reduce((accum, curr) => {
                accum[curr] = ++accum[curr] || 1;
                return accum;
            }, {})

        const resultNonFilteredList = Object.keys(resultObj)
            .map((v, i) => `${v}는 ${resultObj[v]}임`);

        console.log(resultNonFilteredList.join(","));
    },

    showFilteredTodo: function (filteredData) {
        const resultFilteredList = filteredData.reduce((accum, curr) => {
            accum.push(`${curr.name}`)
            return accum
        }, []).join(", ");
        console.log(`todo리스트 총${filteredData.length}건 : ${resultFilteredList}`)
    },

    showTodo: function (...arg) {
        const filterKey = arg[0]

        if (filterKey === "all") {
            showCurrentStatus();
        } else {
            const filterValue = arg[1]
            todo_cli_interface.showFilteredTodo(database.filter(v => v[filterKey] === filterValue));
        }
        rl.prompt();
    },

    delaySyncronizeDatabaseAndShowCurrentStatus: function (time) {
        setTimeout(() => {
            todo_cli_interface.syncronizecDatabase();
            todo_cli_interface.showCurrentStatus();
            rl.prompt();
        }, time)
    },


    addTodo: function (...arg) {
        const [keyString, valueString] = arg;
        const keyArg = keyString.split(",");
        const valueArg = valueString.split(",");

        if (keyArg.length !== valueArg.length) throw new Error("키와 값의 갯수가 맍지 않습니다.");
        const addTodoObj = JSON.parse(JSON.stringify(todo_cli_interface.todoObjectTemplate))

        for (let i = 0; i < keyArg.length; i++) {
            addTodoObj[keyArg[i]] = valueArg[i];
        }

        addTodoObj.id = todo_cli_interface.getHashCode(valueArg[0]);
        database.push(addTodoObj);

        message.add(addTodoObj.name, addTodoObj.id)
        todo_cli_interface.delaySyncronizeDatabaseAndShowCurrentStatus(1000);

    },
    updateTodo: function (objId, objKey, objValue) {
        const updatedData = database.find(v => v.id === parseInt(objId));

        database.forEach((v, i) => {
            if (v.id === parseInt(objId)) {
                v[objKey] = objValue;
            }
        });

        setTimeout(() => {
            message.update(updatedData.name, objKey, objValue)
            todo_cli_interface.delaySyncronizeDatabaseAndShowCurrentStatus(1000);
        }, 3000)



    },
    deleteTodo: function (objId, ...arg) {

        const deletedData = database.find(v => v.id === parseInt(objId));
        database.forEach((v, i) => {
            if (v.id === parseInt(objId)) {
                database.splice(i, 1);
            }
        });
        message.delete(deletedData.name);
        todo_cli_interface.delaySyncronizeDatabaseAndShowCurrentStatus(1000);

    },

    getHashCode: function (inputString) {
        return Math.abs((inputString + Date.now()).split("")
        .reduce( (a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
    },

    parseCommand: function (inputArg) {
        [commandArg, ...deliveryArg] = inputArg.split("$");
        return todo_cli_interface[commandArg + "Todo"](...deliveryArg);
        // todo_cli_interface.COMMAND_DICT[commandArg](...deliveryArg);
    },

    syncronizecDatabase: function () {
        let syncData = JSON.stringify(database, null, 2);
        fs.writeFile('./database.json', syncData, (err) => {
            if (err) throw err;
        });
    },

    run: function () {

        rl.setPrompt('명령하세요 : ');
        rl.prompt();


        rl.on('line', (input) => {

            if (input === "exit") return rl.close()

            todo_cli_interface.parseCommand(input);
        });
    }
}

todo_cli_interface.run();
