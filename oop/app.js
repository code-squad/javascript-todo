const readline = require("readline")
const Todos = require("./Todos.js")
const validator = require("./validator.js")
const ERR_MSG = require("./ErrorConstant").ERR_MSG
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todos = new Todos()

const getCommand = (command) => {
    if (!(command === "undo" || command === "redo") && !validator.isContained(command, "$")) {
        throw Error("NO_SHELL")
    }
    const [inst, ...rest] = command.split("$")
    if (!validator.isCorrectCommand(inst)) {
        throw Error("INCORRECT_INST")
    }
    return [inst, rest]
}

rl.setPrompt("명령어를 입력하세요 : ")
rl.prompt()

rl.on("line", async (command) => {
    if (command === "quit") {
        rl.close()
    } else {
        try {
            [inst, params] = getCommand(command.trim())
            const paramErrorFlag = params.some((el) => {
                return el === undefined && el === null && !el
            })
            if ((todos[inst].length !== params.length) || paramErrorFlag) {
                throw Error("PARAMETER_ERROR")
            }

            await todos[inst](...params)
        } catch (e) {
            console.log('\x1b[31m%s\x1b[0m', "Error : " + ERR_MSG[e.message])
        }

        rl.prompt()


    }
}).on("close", () => {
    process.exit()
})