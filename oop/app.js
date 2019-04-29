const InputController = require("./IController");
const TodoHandler = require("./todoHandler");
const TodoGetter = require('./todoGetter')
const ResultMsg = require('./resultMsg')

const inputController = new InputController()
const resultMsg = new ResultMsg()
const todoGetter = new TodoGetter(resultMsg)
const todoHandler = new TodoHandler(todoGetter, resultMsg)

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
