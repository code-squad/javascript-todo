const todoList = []

function Todos(){}

Todos.prototype.add = function(name, tag){
    console.log(name, tag)
    console.log("add")
}

Todos.prototype.delete = function(id){
    console.log(id)
    console.log("delete")
}

Todos.prototype.update = function(id, status){
    console.log(id, status)
    console.log("update")
}

Todos.prototype.show = function(status){
    console.log(status)
    console.log("show")
}

const generateId = function () {
    let id = 0;
    return id;
}

module.exports = Todos





