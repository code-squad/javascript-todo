const todoList = require('./todo.json')

module.exports = function Model() {
    this.getCountEachStatus = () => {
        return todoList.reduce((countEachStatus, todoObj) => {
            countEachStatus[todoObj.status]++;
            return countEachStatus;
        }, {'todo' : 0, 'doing': 0, 'done': 0});
    }
}