const readline = require("readline")
const ERROR_MESSAGE = {
    "LACKPARAM": "인자의 개수가 부족합니다. 다시 입력해 주세요."
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
            command = this.getParsedCommand(command, "$")
            const command_type = command.shift()
            try {
                this[command_type](...command)
            } catch (e) {
                console.log(e.message)
                if (ERROR_MESSAGE[e.message]) {
                    console.log("\x1b[31m%s\x1b[0m", ERROR_MESSAGE[e.message])
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
        const options = {
            "all": "getStatus",
            "todo": "getListByStatus",
            "doing": "getListByStatus",
            "done": "getListByStatus",
        }

        const answer = this[options[option]](this.todos, option)
        console.log(answer)
        setTimeout(() => {
            rl.prompt()
        }, 0)
    }

    add(name, tags) {
        const id = this.generateId()
        const status = "todo"
        let str = ""
        if (arguments.length !== this.add.length) {
            throw Error("LACKPARAM")
        }
        tags = tags.replace(/\[|\]|\"|\'/g, "").split(",")

        this.todos.push({
            id,
            name,
            tags,
            status
        })
        str = `${name}이(가) 1개 추가하였습니다. (id : ${id})`
        this.printResultAndStatus(str)
    }

    delete(id) {
        const index = this.getIndexById(this.todos, id)
        let str = ""
        const {
            name,
            status
        } = this.todos[index]
        this.todos.splice(index, 1)
        str = `${name} ${status}이(가) 목록에서 삭제되었습니다.`
        this.printResultAndStatus(str)
    }

    update(id, status) {
        const index = this.getIndexById(this.todos, id)
        let str = ""
        this.todos[index].status = status
        setTimeout(() => {
            str = `${this.todos[index].name} ${status}이(가) 목록에서 변경되었습니다.`
            this.printResultAndStatus(str)
        }, 3000)
    }

    printResultAndStatus(str) {
        console.log("\x1b[32m%s\x1b[0m", str)
        setTimeout(() => this.show("all"), 1000)
    }

    generateId() {
        const id = ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)
        return id;
    }

    getIndexById(todos, id) {
        const index = todos.findIndex((el) => {
            return el.id === id
        })
        return index
    }

    getParsedCommand(command, char) {
        command = command.split(char)
        return command
    }

    getCountbyStatus(todos, status) {
        return todos.filter(v => v.status == status).length
    }

    getStatus (todos) {
        let str = ""
        const counts = {
            "todo": this.getCountbyStatus(todos, "todo"),
            "doing": this.getCountbyStatus(todos, "doing"),
            "done": this.getCountbyStatus(todos, "done"),
        }
        str += "현재상태 : " + Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
        return str
    }

    getListByStatus (todos, status) {
        let str = ""
        const count = this.getCountbyStatus(todos, status)
        str += `${status}리스트 : 총 ${count}건 : ` + todos.filter(v => v.status == status).map(v => `'${v.name}, ${v.id}번'`).join(", ")
        return str
    }
}

const todo = new Todos()
todo.start()