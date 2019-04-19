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

const getIndexById = (todos, id) => {
    let index = todos.findIndex((el) => {
        return el.id === id
    })
    return index
}

const getParsedCommand = (command, char) => {
    command = command.split(char)
    return command
}

const getCountbyStatus = (todos, status) => todos.filter(v => v.status == status).length

const getStatus = (todos) => {
    let str = ""
    let counts = {
        "todo": getCountbyStatus(todos,"todo"),
        "doing": getCountbyStatus(todos,"doing"),
        "done": getCountbyStatus(todos,"done"),
    }
    str += "현재상태 : " + Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
    return str
}

const getListByStatus = (todos, status) => {
    let str = ""
    let count = getCountbyStatus(todos, status)
    str += `${status}리스트 : 총 ${count}건 : ` + todos.filter(v => v.status == status).map(v => `'${v.name}, ${v.id}번'`).join(", ")
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
        }).on("close", () => {
            console.log("프로그램을 종료합니다.")
            process.exit()
        })

    }


    show(option) {
        let options = {
            "all" : getStatus,
            "todo" : getListByStatus,
            "doing" : getListByStatus,
            "done" : getListByStatus,
        }

        let answer = options[option](this.todos, option)
        console.log(answer)
        setTimeout(() => {
            rl.prompt()}, 0)
    }

    add(name, tags) {
        let id = generateId()
        let status = "todo"
        let str = ""
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
        str = `${name}이(가) 1개 추가하였습니다. (id : ${id})`
        console.log("\x1b[32m%s\x1b[0m", str)
        setTimeout(() => this.show("all") ,1000)
    }

    delete(id) {
        let index = getIndexById(this.todos, id)
        let str = ""
        let {name, status} = this.todos[index]
        this.todos.splice(index, 1)
        str = `${name} ${status}이(가) 목록에서 삭제되었습니다.`
        console.log("\x1b[32m%s\x1b[0m", str)
        setTimeout(() => this.show("all") ,1000)
    }

    update(id, status) {
        let index = getIndexById(this.todos, id)
        let str = ""
        this.todos[index].status = status
        setTimeout(() => {
            str = `${this.todos[index].name} ${status}이(가) 목록에서 변경되었습니다.`
            console.log("\x1b[32m%s\x1b[0m", str)
            setTimeout(() => this.show("all") ,1000)
        },3000)
    }
}

const todo = new Todos()
todo.start()