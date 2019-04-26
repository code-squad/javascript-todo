class AddManager {
    constructor(model, printer, utility) {
        this.model = model;
        this.printer = printer;
        this.utility = utility
    }
    execute (name, tag) {
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.model.addTodoObject(objToAdd);
        this.printer.printAddMessage(objToAdd);
    }
}

module.exports = AddManager;