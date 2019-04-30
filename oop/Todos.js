const validator = require('./validator.js')
const history = require('./history.js')

const todoUtils = {
    sleep: function (delayTime) {
        return new Promise(resolve => setTimeout(resolve, delayTime))
    },
    generateId: function (id) {
        return ++id
    },
    getListByStatus: function (todoList, status) {
        return todoList.filter(el => el.status === status)
    },
    getAllStr: function (todoList) {
        let str = "현재 상태 : "
        const counts = {
            "todo": this.getListByStatus(todoList, "todo").length,
            "doing": this.getListByStatus(todoList, "doing").length,
            "done": this.getListByStatus(todoList, "done").length
        }
        str += Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
        return str
    },
    getStatusStr: function (todoList, status) {
        let str = ""
        let list = this.getListByStatus(todoList, status)
        let count = list.length
        str += `${status}리스트 : 총${count}건 : `
        str += list.map(el => `'${el.name}, ${el.id}번'`).join(", ")
        return str
    },
}

class Todos {
    constructor() {
        this.todoList = [],
        this.incrementId = 0,
        this.resultDelay = 1000,
        this.updateDelay = 3000
    }

    async add(name, tag) {
        if (validator.checkTagShape(tag)) {
            throw Error("TAG_SHAPE_ERROR")
        }
        this.incrementId = todoUtils.generateId(this.incrementId) 
        const todo = {
            id: this.incrementId,
            name,
            status: "todo",
            tag: tag.replace(/\[|\]|\"|\'|\s/g, "").split(",")
        }
        let message = `${todo.name} 1개가 추가됐습니다.(id : ${todo.id})`
        history.recordTodo(this.todoList)
        this.todoList.push(todo)
        console.log(message)
        await todoUtils.sleep(this.resultDelay)
        this.show("all")
    }

    async delete(id) {
        let index = validator.isExisted(this.todoList, Number(id))
        if (index === -1) throw Error("NOT_EXIST_ID")
        let {
            name,
            status
        } = this.todoList[index]
        let message = `${name} ${status}가 목록에서 삭제됐습니다`
        history.recordTodo(this.todoList)
        this.todoList.splice(index, 1)
        console.log(message)
        await todoUtils.sleep(this.resultDelay)
        this.show("all")
    }

    async update(id, status) {
        let index = validator.isExisted(this.todoList, Number(id))
        if (index === -1) throw Error("NOT_EXIST_ID")

        else if (!validator.isCorrectStatus(status)) throw Error("INCORRECT_STATUS")
        else if (validator.isSameStatus(this.todoList[index], status)) throw Error("SAME_STATUS")

        history.recordTodo(this.todoList)
        this.todoList[index].status = status
        let message = `${this.todoList[index].name}가 ${this.todoList[index].status}으로 상태가 변경됐습니다`
        await todoUtils.sleep(this.updateDelay)
        console.log(message)
        await todoUtils.sleep(this.resultDelay)
        this.show("all")
    }

    async show(status) {
        const option = {
            "all": "getAllStr",
            "todo": "getStatusStr",
            "doing": "getStatusStr",
            "done": "getStatusStr"
        }
        console.log(todoUtils[option[status]](this.todoList, status))
    }

    undo() {
        const {
            todoList: list
        } = history.undo(this.todoList);
        this.todoList.length = 0
        JSON.parse(JSON.stringify([...list])).forEach(el => {
            this.todoList.push(el)
        })
    }

    redo() {
        const {
            todoList: list
        } = history.redo()
        this.todoList.length = 0
        JSON.parse(JSON.stringify([...list])).forEach(el => {
            this.todoList.push(el)
        })
    }
}

module.exports = Todos