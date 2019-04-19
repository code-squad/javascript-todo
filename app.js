const data = require('./data');

const todo_shell = {
    
    todoData : data,

    todoObjectTemplate : {
        name: "",
        category: "",
        status : "",
        id : "",
        deadline: "",
    },

    run: function(){

    },

    parseCommand : function(inputArg){
        // splitedInputArg = inputArg.split("$");
        [commandArg , ... deliveryArg] = inputArg.split("$");
        COMMAND_DICT[commandArg](...deliveryArg);
    },

    addTodo : function(...arg){
        if (arg[0].length !== arg[1].length) throw new Error("키와 값의 갯수가 맍지 않습니다.");
        const addToObj = this.todoObjectTemplate;
        for (let i = 0; i < arg[0].length; i++){
            addToObj[arg[0][i]]  = arg[1][i];
        }
        return addToObj;
    },

    updateTodo: function(objId,objPorp,objValue){
        this.todoData.forEach((v,i) =>{
            if (v.id == objId){
                v[objPorp] = objValue;
            }
        });
    },

    deleteTodo: function(objId, ...arg){
        this.todoData.forEach((v,i) =>{
            if (v.id == objId){
                this.todoData.splice(i,1);
            }
        });
    },

    showTodo: function(...arg){
        if( arg[0] === "all") return this.todoData;
        return this.todoData.filter(todo=>
             todo[arg[0]] === arg[1]
        )
    },


    COMMAND_DICT :{
        show : this.showTodo,
        add : this.addTodo,
        update : this.updateTodo,
        delete : this.deleteTodo,
    },

}


todo_shell.deleteTodo("2");
console.log(todo_shell.todoData);