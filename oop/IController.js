const readline = require("readline")
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