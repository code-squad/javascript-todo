const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateId = () => {
    let id = 0
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
        this.todos = []
        this.INSTRUCTION  = {
            "add" : this.add,
            "show" : this.show,
            "update" : this.update,
            "delete" : this.delete
        }
    }

    start(){
        rl.question("명령하세요 : ", (inst)=> {
            if (inst === "quit" || inst === "q") {
                console.log("프로그램을 종료합니다.")
                rl.close()
                return;
            }
            inst = splitStringByChar(inst, "$")
            let instruction_type = inst.shift()
            try {
                this.INSTRUCTION[instruction_type](...inst)
            } catch {
                console.log("\x1b[31m%s\x1b[0m", "올바르지 않은 명령어입나다.")
                console.log("\x1b[31m%s\x1b[0m", "사용할 수 있는 명령어 : show | add | update | delete")
            } finally {
                this.start()
            }
        })
        
    }

    show() {

    }

    add() {
    }

    delete() {

    }

    update() {

    }
}

const todo = new Todos()
todo.start()