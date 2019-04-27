const readline = require("readline")
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