const Utility = require('./utility')
const todoList = require('./todo.json')

const utility = new Utility();

function Model() {}

Model.prototype.getCountEachStatus = function () {
    return todoList.reduce((countEachStatus, todoObj) => {
        countEachStatus[todoObj.status]++;
        return countEachStatus;
    }, {'todo' : 0, 'doing': 0, 'done': 0});
}

Model.prototype.getListInStatus = function (status) {
    return todoList.filter((todoObj) => { return todoObj.status === status; })
                    .reduce((listInStatus, todoObj) => {
                        listInStatus.push(`'${todoObj.name}, ${todoObj.id}번'`);
                        return listInStatus;
                    }, []);
}

Model.prototype.addTodoObject = function (todoObj) {
    todoList.push(todoObj);
    utility.save(todoList);
}

Model.prototype.deleteTodoObject = function (id) {
    const objToDelete = utility.getObjectById(id);
    todoList.splice(todoList.indexOf(objToDelete), 1);
    utility.save(todoList);
    return objToDelete;
}

Model.prototype.updateTodoObject = function (id, status) {
    const index = utility.getIndexById(id);
    todoList[index].status = status;
    utility.save(todoList);
    return todoList[index];
}

module.exports = Model;