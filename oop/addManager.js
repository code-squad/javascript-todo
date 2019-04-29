class AddManager {
    constructor(model, utility) {
        this.model = model;
        this.utility = utility
    }
    execute (name, tag) {
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.model.addTodoObject(objToAdd);
        return objToAdd;
    }
}

module.exports = AddManager;