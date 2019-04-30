class Model {
    constructor (utility, todoList) {
        this.utility = utility;
        this.todoList = todoList;
    }

    getCountEachStatus () {
        return this.todoList.reduce((countEachStatus, todoObj) => {
            countEachStatus[todoObj.status]++;
            return countEachStatus;
        }, {'todo' : 0, 'doing': 0, 'done': 0});
    }
    
    getListInStatus (status) {
        return this.todoList.filter((todoObj) => { return todoObj.status === status; })
                        .reduce((listInStatus, todoObj) => {
                            listInStatus.push(`'${todoObj.name}, ${todoObj.id}번'`);
                            return listInStatus;
                        }, []);
    }
    
    addTodoObject (todoObj) {
        this.todoList.push(todoObj);
        this.utility.save(this.todoList);
    }
    
    deleteTodoObject (id) {
        const objToDelete = this.utility.getObjectById(id);
        this.todoList.splice(this.todoList.indexOf(objToDelete), 1);
        this.utility.save(this.todoList);
        return objToDelete;
    }
    
    updateTodoObject (id, status) {
        const index = this.utility.getIndexById(id);
        this.todoList[index].status = status;
        this.utility.save(this.todoList);
        return this.todoList[index];
    }
}

module.exports = Model;