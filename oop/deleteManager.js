class DeleteMananger {
    constructor(model, printer) {
        this.model = model;
        this.printer = printer;
    }
    execute(id) {
        const objToDelete = this.model.deleteTodoObject(id);
        return objToDelete;
    }
}

module.exports = DeleteMananger;