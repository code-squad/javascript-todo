const readline = require("readline")
const Todos = require("./Todos.js")
const Validation = require("./Validation.js")
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
            [inst, params] = getCommand(command)
            if(todos[inst].length !== params.length) {
                throw Error("LACK_PARAMETER")
            }
            todos[inst](...params)
        } catch(e) {
            const error = {
                "NO_SHELL" : "명령어에 $를 포함시켜주세요.",
                "INCORRECT_INST" : "사용가능한 명령어는 add | update | delete | show 입니다.",
                "LACK_PARAMETER" : "명령어를 실행하는데 매게변수가 부족합니다."
            }
            console.log('\x1b[31m%s\x1b[0m',"Error : " + error[e.message])
        }
        rl.prompt()
    }
}).on("close", () => {
    process.exit()
})


