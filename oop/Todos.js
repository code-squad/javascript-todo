const validator = require('./validator.js')
const historyQueue = {
    data: [],
    maxLength: 4
}
const todoList = []
let incrementId = 0

const todoUtils = {
    sleep: function (msec) {
        return new Promise(resolve => setTimeout(resolve, msec))
    },
    generateId: function () {
        return incrementId++
    },
    getListByStatus: function (status) {
        return todoList.filter(el => el.status === status)
    },
    getCountByStatus: function (status) {
        return todoList.filter(el => el.status === status).length
    },
    getAllStr: function () {
        let str = "현재 상태 : "
        const counts = {
            "todo": this.getCountByStatus("todo"),
            "doing": this.getCountByStatus("doing"),
            "done": this.getCountByStatus("done")
        }
        str += Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
        return str
    },
    getStatusStr: function (status) {
        let str = ""
        let count = this.getCountByStatus(status)
        let list = this.getListByStatus(status)
        str += `${status}리스트 : 총${count}건 : `
        str += list.map(el => `'${el.name}, ${el.id}번'`).join(", ")
        return str
    },
}

class Todos {
    async add(name, tag) {
        if (validator.checkTagShape(tag)) throw Error("TAG_SHAPE_ERROR")
        const todo = {
            id: todoUtils.generateId(),
            name,
            status: "todo",
            tag: tag.replace(/\[|\]|\"|\'|\s/g, "").split(",")
        }
        todoList.push(todo)
        console.log(`${todo.name} 1개가 추가됐습니다.(id : ${todo.id})`)
        await todoUtils.sleep(1000)
        this.show("all")
    }

    async delete(id) {
        let index = validator.isExisted(todoList, Number(id))
        if (index === -1) throw Error("NOT_EXIST_ID")
        let {
            name,
            status
        } = todoList[index]
        delete todoList[index]
        console.log(`${name} ${status}가 목록에서 삭제됐습니다`)
        await todoUtils.sleep(1000)
        this.show("all")
    }

    async update(id, status) {
        let index = validator.isExisted(todoList, Number(id))
        if (index === -1) throw Error("NOT_EXIST_ID")
        else if (!validator.isCorrectStatus(status)) throw Error("INCORRECT_STATUS")
        else if (validator.isSameStatus(todoList[index], status)) throw Error("SAME_STATUS")
        todoList[index].status = status
        await todoUtils.sleep(3000)
        console.log(`${todoList[index].name}가 ${todoList[index].status}으로 상태가 변경됐습니다`)
        await todoUtils.sleep(1000)
        this.show("all")
    }

    async show(status) {
        const option = {
            "all": "getAllStr",
            "todo": "getStatusStr",
            "doing": "getStatusStr",
            "done": "getStatusStr"
        }
        console.log(todoUtils[option[status]](status))
    }
}
module.exports = Todos