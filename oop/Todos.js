const Validation = require('./Validation.js')
const validation = new Validation()
const todoList = []
let incrementId = 0

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

function Todos() {}

Todos.prototype.add = async function (name, tag) {
    if(validation.checkTagShape(tag)) throw Error("TAG_SHAPE_ERROR")
    const todo = {
        id: generateId(),
        name,
        status: "todo",
        tag: tag.replace(/\[|\]|\"|\'|\s/g, "").split(",")
    }
    todoList.push(todo)
    console.log(`${todo.name} 1개가 추가됐습니다.(id : ${todo.id})`)
    await sleep(1000)
    this.show("all")
}

Todos.prototype.delete = async function (id) {
    let index = validation.isExisted(todoList, Number(id))
    if (index === -1) throw Error("NOT_EXIST_ID")
    let {name, status} = todoList[index]
    delete todoList[index]
    console.log(`${name} ${status}가 목록에서 삭제됐습니다`)
    await sleep(1000)
    this.show("all")
}

Todos.prototype.update = async function (id, status) {
    let index = validation.isExisted(todoList, Number(id))
    if (index === -1) throw Error("NOT_EXIST_ID")
    else if (!validation.isCorrectStatus(status)) throw Error("INCORRECT_STATUS")
    else if (validation.isSameStatus(todoList[index], status)) throw Error("SAME_STATUS")
    todoList[index].status = status
    await sleep(3000)
    console.log(`${todoList[index].name}가 ${todoList[index].status}으로 상태가 변경됐습니다`)
    await sleep(1000)
    this.show("all")
}

Todos.prototype.show = function (status) {
    const option = {
        "all": showAll,
        "todo": showStatus,
        "doing": showStatus,
        "done": showStatus
    }

    console.log(option[status](status))
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