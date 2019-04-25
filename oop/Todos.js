const todoList = []
let incrementId = 0

function Todos() {}

Todos.prototype.add = function (name, tag) {
    const todo = {
        id: generateId(),
        name,
        tag
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
    return todoList
}

const showStatus = function (status) {
    return todoList
}

module.exports = Todos