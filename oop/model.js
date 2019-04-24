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

    this.addTodoList = (todoObj) => {
        todoList.push(todoObj);
        fs.writeFileSync('todo.json', JSON.stringify(todoList));
    }
}