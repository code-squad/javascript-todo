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

const getIndexById = (id) => {
    let index = -1;
    return index
}

const getParsedCommand = (command, s) => {
    command = command.split(s)
    return command
}

const getCountbyStatus = (todos, status) => todos.filter(v => v.status == status).length

const getTodos = (todos) => {
    let str = ""
    let counts = {
        "todo": getCountbyStatus(todos,"todo"),
        "doing": getCountbyStatus(todos,"doing"),
        "done": getCountbyStatus(todos,"done"),
    }
    str += "현재상태 : " + Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
    return str
}

const getTodosByStatus = (todos, status) => {
    let str = ""
    let count = getCountbyStatus(todos, status)
    str += `${status}리스트 : 총 ${count}건 : ` + todos.filter(v => v.status == status).map(v => v.name).join(", ")
    return str
}

class Todos {
    constructor() {
        this.todos = []
    }

    start() {
        rl.setPrompt("명령하세요 : ")
        rl.prompt()
        rl.on("line", (command) => {
            if (command === "quit()" || command === "q()") {
                rl.close()
            }
            command = getParsedCommand(command, "$")
            let command_type = command.shift()
            try {
                this[command_type](...command) 
            } catch(e) {
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


    show(option) {
        let options = {
            "all" : getTodos,
            "todo" : getTodosByStatus,
            "doing" : getTodosByStatus,
            "done" : getTodosByStatus,
        }

        let answer = options[option](this.todos, option)
        console.log(answer)
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
        setTimeout(() => this.show("all") ,1000)
    }

    delete() {

    }

    update() {

    }
}

const todo = new Todos()
todo.start()