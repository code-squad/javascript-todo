const todoData = require('./database.json');

class todo_shell {

    constructor(params) {
        this.todoObjectTemplate = {
            ame: "",
            category: "",
            status: "",
            id: "",
            deadline: "",
        };
        this.todoData = todoData;
    }

    getHashCode(inputArg) {
        return Math.abs((inputArg + Date.now()).split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
    }

    syncronizeDatabase() {
        const fs = require('fs');
        let syncData = JSON.stringify(this.todoData, null, 2);
        fs.writeFile('./database.json', syncData, (err) => {
            if (err) throw err;
        });
    }

    addTodo(...arg) {
        const argKey = arg[0].split(",");
        const argValue = arg[1].split(",");

        if(argKey.length !== argValue.length) throw new Error("키 밸류 안맞음");
        
        const addToObj = this.todoObjectTemplate;
        for(let i = 0; i < argKey.length; i++){
            addToObj[argKey[i]] = argValue[i];
        }
        this.todoData.push(addToObj);
    }

    updateTodo(objId, objProp, objValue){
        this.todoData.forEach((v,i) =>{
            if (v.id == objId){
                v[objProp] = objValue;
            }
        });
    }

    deleteTodo(objId){
        this.todoData((v,i) =>{
            if (v.id == objId){
                todoData.splice(i,1);
            }
        });
    }

    showTodo(...arg){
        if (arg[0] === "all"){
            console.log(todoData);
        }else{
            console.log(todoData.filter(v=>v.arg[1] === arg[2]));
        }
    }
    
    parseCommand(inputArg){
        var that = this;
        const COMM_DICT = {
            show: that.showTodo,
            add: that.addTodo,
            update: that.updateTodo,
            delete: that.deleteTodo,
        };
        let commArg;
        let deliveryArg;
        [commArg, ...deliveryArg] = inputArg.split("$");
        COMM_DICT[commArg](...deliveryArg);
    }

}

const shell = new todo_shell();
shell.parseCommand("show$all");
shell.parseCommand("add$name,status$kk,done");