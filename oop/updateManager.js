class UpdateManager {
    constructor(model) {
        this.model = model;
    }
    execute (id, status) {
        const objToUpdate = this.model.updateTodoObject(id, status); 
        return objToUpdate;
    }
}

module.exports = UpdateManager;