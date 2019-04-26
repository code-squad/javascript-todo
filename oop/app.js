<<<<<<< HEAD
const InputController = require("./IController");
const TodoHandler = require("./todoHandler");
const TodoChecker = require('./todoChecker')
const ResultMsg = require('./resultMsg')

const inputController = new InputController()
const resultMsg = new ResultMsg()
const todoChecker = new TodoChecker(resultMsg)
const todoHandler = new TodoHandler(todoChecker, resultMsg)

const inputHandler = function(inputdata){
  try{
    let { command, args } = inputController.checkInput(inputdata)
    process.emit("userInput", command, args)
  } catch(e){
    console.log(e.message)
    inputController.rl.prompt()
  }
}

const ready = function(){
  inputController.rl.prompt();
  inputController.rl.on("line", inputHandler)
}

process.on("userInput", async (command, args) =>{
    try {
      if(command === 'add'){
        await todoHandler.add(...args)
        inputController.rl.prompt();
        return
      }
      await todoHandler[command](...args)
      inputController.rl.prompt();
    } catch(e){
      console.log(e.message)
      inputController.rl.prompt()
    }
})

ready();
=======
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
>>>>>>> Get seldev's oop project
