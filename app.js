const data = require('./data');

const todo_shell = {
    
    todoData : data,

    run: function(){

    },

    parseCommand : function(inputArg){
        // splitedInputArg = inputArg.split("$");
        [commandArg , ... deliveryArg] = inputArg.split("$");
        COMMAND_DICT[commandArg](...deliveryArg);
    },

    addTodo : function(...arg){
        
    },

    updateTodo: function(){

    },

    deleteTodo: function(){

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