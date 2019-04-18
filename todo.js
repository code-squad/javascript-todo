const readline = require("readline")
const ERROR = {
    "LACKPARAM" : "인자의 개수가 부족합니다. 다시 입력해 주세요."
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateId = () => {
    let id = ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
    return id;
}

const getTodoIndex = (id) => {
    let index = -1;
    return index
}

const splitStringByChar = (inst, s) => {
    let instruction = inst.split(s)
    return instruction
}

class Todos {
    constructor() {
        this.todos = [{a : 1}]
    }

    start() {
        rl.setPrompt("명령하세요 : ")
        rl.prompt()
        rl.on("line", (inst) => {
            if (inst === "quit()" || inst === "q()") {
                rl.close()
            }
            inst = splitStringByChar(inst, "$")
            let instruction_type = inst.shift()
            try {
                
                this[instruction_type](...inst) 
            } catch(e) {
                console.log(e.message)
                if (ERROR[e.message]) {
                    console.log("\x1b[31m%s\x1b[0m", ERROR[e.message])
                } else {
                    console.log("\x1b[31m%s\x1b[0m", "올바르지 않은 명령어입나다.\n사용할 수 있는 명령어 : show | add | update | delete")
                }
            }
            rl.prompt()
        }).on("close", () => {
            console.log("프로그램을 종료합니다.")
            process.exit()
        })

    }

    show() {
        console.log("SHOW!")

    }

    add(name, tags) {
        let id = generateId()
        let status = "todo"
        if(arguments.length !== this.add.length){
            throw Error("LACKPARAM")
        }
        tags = tags.replace(/\[|\]|\"|\'/g, "").split(",")

        this.todos.push(
            {
                id,
                name,
                tags,
                status
            }
        )
        console.dir(this.todos)
        setTimeout(this.show,1000)
    }

    delete() {

    }

    update() {

    }
}

const todo = new Todos()
todo.start()