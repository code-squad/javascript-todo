const Model = require('./model')
const Utility = require('./utility')
const ErrorHandler = require('./errorHandler')
const Printer = require('./printer');

module.exports = function Controller() {
    const model = new Model();
    const utility = new Utility();
    const errorHandler = new ErrorHandler();
    const printer = new Printer();
    
    this.splitInput = (inputArray) => {
        return inputArray.split('$');
    }

    this.instruct = (input) => {
        if(!(errorHandler.usageErrorCheck(input))) return;
        const inputArray = this.splitInput(input);
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

    this.show = (status) => {
        if(status === 'all') {
            const countEachStatus = model.getCountEachStatus();
            printer.printMessageShowAll(countEachStatus);
            return;
        }
        const listInStatus = model.getListInStatus(status);
        printer.printMessageShowStatus(status, listInStatus);
    }

    this.add = (name, tag) => {
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': utility.getRandomID()};
        model.addTodoObject(objToAdd);
        printer.printMessageAdd(objToAdd);
        setTimeout( () => { this.show('all'); }, 1000);
    }

    this.delete = (id) => {
        const objToDelete = model.deleteTodoObject(id);
        printer.printMessageDelete(objToDelete);
        setTimeout( () => { this.show('all'); }, 1000);
    }

    this.update = (id, status) => {
        const objToUpdate = model.updateTodoObject(id, status);
        setTimeout(() => {
            printer.printMessageUpdate(objToUpdate);
            setTimeout( () => { this.show('all'); }, 1000);
        }, 3000)
    }
}