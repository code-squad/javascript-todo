

const todo_shell = {
    todoData : require('./database.json'),
    
    todoObjectTemplate: {
        name: "",
        category: "",
        status: "",
        id: "",
        deadline: "",
    },
    run: function (args) {
        this.parseCommand(args);
    },

    addTodo: function (...arg) {
        if (arg[0].length !== arg[1].length) throw new Error("키와 값의 갯수가 맍지 않습니다.");
        const addToObj = this.todoObjectTemplate;
        for (let i = 0; i < arg[0].length; i++) {
            addToObj[arg[0][i]] = arg[1][i];
        }

        addToObj.id = this.getHashCode(arg[1][0]);
        this.todoData.push(addToObj);
    },

    updateTodo: function (objId, objPorp, objValue) {
        this.todoData.forEach((v, i) => {
            if (v.id == objId) {
                v[objPorp] = objValue;
            }
        });
    },

    deleteTodo: function (objId, ...arg) {
        this.todoData.forEach((v, i) => {
            if (v.id == objId) {
                todoData.splice(i, 1);
            }
        });
    },

    showTodo: function (...arg) {
        if (arg[0] === "all") {
        var a = this.todoData;
        console.log(a);
        }
        // return this.todoData.filter(todo =>
        //     todo[arg[0]] === arg[1]
        // )
    },

    syncronizecDatabase: function () {
        let syncData = JSON.stringify(this.todoData, null, 2);
        fs.writeFile('./database.json', syncData, (err) => {
            if (err) throw err;
        });
    },

    getHashCode: function (inputString) {
        return Math.abs((inputString + Date.now()).split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
    },

    parseCommand: function (inputArg) {
        [commandArg, ...deliveryArg] = inputArg.split("$");
        COMMAND_DICT[commandArg](...deliveryArg);
    }

}

const COMMAND_DICT = {
    show: todo_shell.showTodo,
    add: todo_shell.addTodo,
    update: todo_shell.updateTodo,
    delete: todo_shell.deleteTodo,
}

todo_shell.run("show$all");