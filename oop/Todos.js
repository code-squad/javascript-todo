const Validation = require('./Validation.js')
const validation = new Validation()
const NOTE_FUNC = require('./Message').NOTE_FUNC
const todoList = []
let incrementId = 0

function Todos() {}

Todos.prototype.add = function (name, tag) {
    const todo = {
        id: generateId(),
        name,
        status: "todo",
        tag: tag.replace(/\[|\]|\"|\'|\s/g, "").split(",")
    }
    todoList.push(todo)
    NOTE_FUNC({inst: "add", id: todo.id, name: todo.name})
}

Todos.prototype.delete = function (id) {
    let index = validation.isExisted(todoList, Number(id))
    if (index === -1) throw Error("NOT_EXIST_ID")
    let {name, status} = todoList[index]
    delete todoList[index]

    NOTE_FUNC({inst: "delete", name, status })
}

Todos.prototype.update = function (id, status) {
    let index = validation.isExisted(todoList, Number(id))
    if (index === -1) throw Error("NOT_EXIST_ID")
    else if (!validation.isCorrectStatus(status)) throw Error("INCORRECT_STATUS")
    else if (validation.isSameStatus(todoList[index], status)) throw Error("SAME_STATUS")
    todoList[index].status = status

    NOTE_FUNC({inst: "update", name: todoList[index].name, status})
}

Todos.prototype.show = function (status) {
    const option = {
        "all": showAll,
        "todo": showStatus,
        "doing": showStatus,
        "done": showStatus
    }
    option[status](status)
}

const generateId = function () {
    return incrementId++;
}

const showAll = function () {
    let str = "현재 상태 : "
    const counts = {
        "todo": getCountByStatus("todo"),
        "doing": getCountByStatus("doing"),
        "done": getCountByStatus("done")
    }
    str += Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
    NOTE_FUNC({inst:"showAll", str})
}

const showStatus = function (status) {
    let str = ""
    let count = getCountByStatus(status)
    let list = getListByStatus(status)
    str += `${status}리스트 : 총${count}건 : `
    str += list.map(el => `'${el.name}, ${el.id}번'`).join(", ")
    NOTE_FUNC({inst:"showStatus", str})
}

const getCountByStatus = status => todoList.filter(el => el.status === status).length

const getListByStatus = status => {
    return todoList.filter(el => el.status === status)
}
module.exports = Todos