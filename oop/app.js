const IC = require("./IController");
const Todo = require("./todo");


process.on("userInput", async (userInput) =>{
    let command = userInput[0]
    let args = userInput.slice(1)
    if(command === 'add'){
      const newTodo = new Todo.Todo(...args)  
      await newTodo.add()
      IC.rl.prompt();
      return
    } else{
      defaultTodo = new Todo.Todo('default', "[]")
    }
    await defaultTodo[command](...args)

    IC.rl.prompt();
    
})

IC.ready();