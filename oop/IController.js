const readline = require("readline")
<<<<<<< HEAD
const ResultMsg = require('./ResultMsg')
const resultMsg = new ResultMsg()

const InputController = function(){
  this.rl = readline.createInterface({
      input : process.stdin,
      output : process.stdout,
      prompt :  "질문하세요"
  })
}

InputController.prototype = {
  checkSperator : function(input, sperator = '$'){
    if(!input.includes(sperator)) throw new Error(resultMsg.noSeperator());
  },
  checkCommand : function (command) {
    if(!/show|add|update|delete/.test(command)){
      throw new Error(resultMsg.invalidCommand())
    }
  },
  checkArgsCount : function (command, args){
    if((/show|delete/.test(command) && args.length===1)){
      return
    }
    if((/add|update/.test(command) && args.length===2)){
      return 
    }
    throw new Error(resultMsg.invalidArgsCounts())
  },
  checkInput : function(input){
    this.checkSperator(input) 
    inputList = input.split('$')
    let command = inputList[0]
    let args = inputList.slice(1)
    this.checkCommand(command)
    this.checkArgsCount(command, args)
    return {command, args}
  }
}


module.exports = InputController
=======
const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt :  "질문하세요"
})



const isIn$ = function(input){
     return input.includes("$");
}


const inputHandler = function(inputdata){
    if(!isIn$(inputdata)){
        console.log("명령을 $로 구분해주세요")
        rl.prompt();
    }
    process.emit("userInput", inputdata.split('$'))
}

const ready = function(){
    rl.prompt();
    rl.on("line", inputHandler)
}



module.exports = {ready, rl}
>>>>>>> Get seldev's oop project
