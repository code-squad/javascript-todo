const IC = require("./IController");
const Todo = require("./todo");
const fs = require('fs');

const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)
console.log(todos)

const todoList = new Todo(todos);
process.on("userInput", (userInput) =>{
    console.log(userInput);
    let command = userInput[0]
    let args = userInput.slice(1)
    todoList[command](...args)
    console.log(todoList.toods)
    IC.rl.prompt();
    
})



//inputControll.inputHandler("show$all");
IC.ready();