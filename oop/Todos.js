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
}

Todos.prototype.delete = function (id) {
    console.log(id)
    console.log("delete")
}

Todos.prototype.update = function (id, status) {
    console.log(id, status)
    console.log("update")
}

Todos.prototype.show = function (status) {
    const option = {
        "all": showAll,
        "todo": showStatus,
        "doing": showStatus,
        "done": showStatus
    }
    const answer = option[status](status)
    console.log(answer)
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
    return str
}

const showStatus = function (status) {
    let str = ""
    let count = getCountByStatus(status)
    let list = getListByStatus(status)
    str += `${status}리스트 : 총${count}건 : `
    str += list.map(el => `'${el.name}, ${el.id}번'`).join(", ")
    return str
}

const getCountByStatus = status => todoList.filter(el => el.status === status).length

const getListByStatus = status => {
    return todoList.filter(el => el.status === status)
}
module.exports = Todos