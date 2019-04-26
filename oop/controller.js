// const ErrorHandler = require('./errorHandler')
// const Printer = require('./printer')
// const this.utility = require('./this.utility')
// const Model = require('./model')

// const errorHandler = new ErrorHandler();
// const this.utility = new this.utility();
// const printer = new Printer();
// const model = new Model();

function Controller(model, utility, printer, errorHandler) {
    this.model = model;
    this.utility = utility;
    this.printer = printer;
    this.errorHandler = errorHandler;
}

Controller.prototype.instruct = function (input) {
    if(!(this.errorHandler.usageErrorCheck(input))) return;
    const inputArray = this.utility.splitInput(input);
    const command = inputArray[0];
    switch(command) {
        case 'show' :
            const statusShow = inputArray[1];
            this.show(statusShow);
            break;
        case 'add' :
            const name = inputArray[1];
            const tag = inputArray[2];
            this.add(name, tag);
            break;
        case 'delete' :
            const idDelete = inputArray[1];
            if(!(this.errorHandler.notExistIdErrorCheck(idDelete))) return;
            this.delete(idDelete);
            break;
        case 'update' :
            const idUpdate = inputArray[1];
            const statusUpdate = inputArray[2];
            if(!(this.errorHandler.notExistIdErrorCheck(idUpdate))) return;
            if(!(this.errorHandler.sameStatusErrorCheck(idUpdate, statusUpdate))) return;
            this.update(idUpdate, statusUpdate);
            break;
    }
}

Controller.prototype.show = function (status) {
    if(status === 'all') {
        const countEachStatus = this.model.getCountEachStatus();
        this.printer.printMessageShowAll(countEachStatus);
        return;
    }
    const listInStatus = this.model.getListInStatus(status);
    this.printer.printMessageShowStatus(status, listInStatus);
}

Controller.prototype.add = function (name, tag) {
    const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
    this.model.addTodoObject(objToAdd);
    this.printer.printMessageAdd(objToAdd);
    this.throwSetTimeForShowAll();
}

Controller.prototype.delete = function (id) {
    const objToDelete = this.model.deleteTodoObject(id);
    this.printer.printMessageDelete(objToDelete);
    this.throwSetTimeForShowAll();
}

Controller.prototype.update = function (id, status) {
    const objToUpdate = this.model.updateTodoObject(id, status);   
    this.throwSetTimeForUpdate(objToUpdate);
}

Controller.prototype.throwSetTimeForShowAll = function (delayTime = 1000) {
    setTimeout( () => { this.show('all'); }, delayTime); 
}

Controller.prototype.throwSetTimeForUpdate = function(objToUpdate, delayTime = 3000) { 
    setTimeout( 
        () => { 
            this.printer.printMessageUpdate(objToUpdate);
            this.throwSetTimeForShowAll();
        }, delayTime);
}

module.exports = Controller;