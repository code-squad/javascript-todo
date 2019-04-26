const IC = require("./IController");
const TodoHandler = require("./todoHandler");
const TodoChecker = require('./todoChecker')
const ResultMsg = require('./resultMsg')

const resultMsg = new ResultMsg()
const todoChecker = new TodoChecker(resultMsg)
const todoHandler = new TodoHandler(todoChecker, resultMsg)

process.on("userInput", async (userInput) =>{
    let command = userInput[0]
    let args = userInput.slice(1)
    try {
      if(command === 'add'){
        await todoHandler.add(...args)
        IC.rl.prompt();
        return
      }
      
      await todoHandler[command](...args)
      IC.rl.prompt();
    } catch(e){

    }
})

IC.ready();