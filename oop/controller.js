const ErrorHandler = require('./errorHandler')
const Spliter = require('./spliter')
const Printer = require('./printer')
const Utility = require('./utility')
const Model = require('./model')

const errorHandler = new ErrorHandler();
const spliter = new Spliter();
const utility = new Utility();
const printer = new Printer();
const model = new Model();

function Controller() {}

Controller.prototype.instruct = function (input) {
    if(!(errorHandler.usageErrorCheck(input))) return;
    const inputArray = spliter.splitInput(input);
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
            if(!(errorHandler.notExistIdErrorCheck(idDelete))) return;
            this.delete(idDelete);
            break;
        case 'update' :
            const idUpdate = inputArray[1];
            const statusUpdate = inputArray[2];
            if(!(errorHandler.notExistIdErrorCheck(idUpdate))) return;
            if(!(errorHandler.sameStatusErrorCheck(idUpdate, statusUpdate))) return;
            this.update(idUpdate, statusUpdate);
            break;
    }
}

Controller.prototype.show = function (status) {
    if(status === 'all') {
        const countEachStatus = model.getCountEachStatus();
        printer.printMessageShowAll(countEachStatus);
        return;
    }
    const listInStatus = model.getListInStatus(status);
    printer.printMessageShowStatus(status, listInStatus);
}

Controller.prototype.add = function (name, tag) {
    const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': utility.getRandomID()};
    model.addTodoObject(objToAdd);
    printer.printMessageAdd(objToAdd);
    this.throwSetTimeForShowAll();
}

Controller.prototype.delete = function (id) {
    const objToDelete = model.deleteTodoObject(id);
    printer.printMessageDelete(objToDelete);
    this.throwSetTimeForShowAll();
}

Controller.prototype.update = function (id, status) {
    const objToUpdate = model.updateTodoObject(id, status);   
    this.throwSetTimeForUpdate(objToUpdate);
}

Controller.prototype.throwSetTimeForShowAll = function (delayTime = 1000) {
    setTimeout( () => { this.show('all'); }, delayTime); 
}

Controller.prototype.throwSetTimeForUpdate = function(objToUpdate, delayTime = 3000) { 
    setTimeout( 
        () => { 
            printer.printMessageUpdate(objToUpdate);
            this.throwSetTimeForShowAll();
        }, delayTime);
}

module.exports = Controller;