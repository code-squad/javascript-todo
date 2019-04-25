const readline = require("readline")
const Todos = require("./Todos.js")
const Validation = require("./Validation.js")
const ERR_MSG = require("./Message").ERR_MSG 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todos = new Todos()
const validation = new Validation()

const getCommand = (command) => {
    if (!validation.isContained(command, "$")) {
        throw Error("NO_SHELL")
    }
    const [inst, ...rest] = command.split("$")
    if (!validation.isCorrectCommand(inst)) {
        throw Error("INCORRECT_INST")
    }
    return [inst, rest]
}

rl.setPrompt("명령어를 입력하세요 : ")
rl.prompt()

rl.on("line", (command) => {
    if (command === "quit") {
        rl.close()
    } 
    else {
        try {
            [inst, params] = getCommand(command.trim())
            if(todos[inst].length !== params.length) {
                throw Error("LACK_PARAMETER")
            }
            todos[inst](...params)
        } catch(e) {
            console.log('\x1b[31m%s\x1b[0m',"Error : " + ERR_MSG[e.message])
        }
        rl.prompt()
    }
}).on("close", () => {
    process.exit()
})


