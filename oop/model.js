const todoList = require('./todo.json')
const fs = require('fs')

module.exports = function Model() {
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
        const objToDelete = todoList.find(todoObj => todoObj.id === parseInt(id));
        todoList.splice(todoList.indexOf(objToDelete), 1);
        fs.writeFileSync('todo.json', JSON.stringify(todoList));
        return objToDelete;
    }

    this.updateTodoObject = (id, status) => {
        let objToUpdate;
        todoList.forEach((todoObj) => {
            if(todoObj.id === parseInt(id)) {
                todoObj.status = status;
                fs.writeFileSync('todo.json', JSON.stringify(todoList));
                objToUpdate = todoObj;
            }
        });
        return objToUpdate;
    }
}