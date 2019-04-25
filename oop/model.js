const todoList = require('./todo.json')
const Finder = require('./finder')
const fs = require('fs')

module.exports = function Model() {
    const finder = new Finder();
    this.getCountEachStatus = () => {
        return todoList.reduce((countEachStatus, todoObj) => {
            countEachStatus[todoObj.status]++;
            return countEachStatus;
        }, {'todo' : 0, 'doing': 0, 'done': 0});
    }

    this.getListInStatus = (status) => {
        return todoList.filter((todoObj) => { return todoObj.status === status; })
                        .reduce((listInStatus, todoObj) => {
                            listInStatus.push(`'${todoObj.name}, ${todoObj.id}번'`);
                            return listInStatus;
                        }, []);
    }

    this.addTodoObject = (todoObj) => {
        todoList.push(todoObj);
        fs.writeFileSync('todo.json', JSON.stringify(todoList));
    }

    this.deleteTodoObject = (id) => {
        const objToDelete = finder.getObjectById(id);
        todoList.splice(todoList.indexOf(objToDelete), 1);
        fs.writeFileSync('todo.json', JSON.stringify(todoList));
        return objToDelete;
    }

    this.updateTodoObject = (id, status) => {
        const index = finder.getIndexById(id);
        todoList[index].status = status;
        fs.writeFileSync('todo.json', JSON.stringify(todoList));
        return todoList[index];
    }
}