const todoList = require("./todo");
const myTodoList = new todoList();

const readline = require("readline");
const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout
});

rl.on("line", function(line){
    console.log("hello !", line);
    // rl.close();

}).on("close", function() {
    process.exit();
});












// myTodoList.show("all");
// myTodoList.show("todo");
// myTodoList.show("doing");
// myTodoList.show("done");

