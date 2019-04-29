const readline = require("readline")
const ResultMsg = require('./ResultMsg')
const resultMsg = new ResultMsg()

class InputController {
  constructor(){
    this.rl = readline.createInterface({
      input : process.stdin,
      output : process.stdout,
      prompt :  "질문하세요"
    })
  }
  checkSperator(input, sperator = '$'){
    if(/undo|redo/.test(input)) return
    if(!input.includes(sperator)) throw new Error(resultMsg.noSeperator());
  }
  checkCommand (command) {
    if(!/show|add|update|delete|undo|redo/.test(command)){
      throw new Error(resultMsg.invalidCommand())
    }
  }
  checkArgsCount (command, args){
    if(/undo|redo/.test(command)) return
    if((/show|delete/.test(command) && args.length===1)){
      return
    }
    if((/add|update/.test(command) && args.length===2)){
      return 
    }
    throw new Error(resultMsg.invalidArgsCounts())
  }
  checkInput (input){
    this.checkSperator(input) 
    let inputList = input.split('$')
    let command = inputList[0]
    let args = inputList.slice(1)
    this.checkCommand(command)
    this.checkArgsCount(command, args)
    return {command, args}
  }
}

module.exports = InputController