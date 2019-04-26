class Controller {
    constructor (model, utility, printer, errorHandler, commandMannger) {
        this.model          = model;
        this.utility        = utility;
        this.printer        = printer;
        this.errorHandler   = errorHandler;
        this.commandMannger = commandMannger;
    }

    instruct (input, commandObj) {
        if(!(this.errorHandler.usageErrorCheck(input))) return;
        const inputArray = this.utility.splitInput(input);
        this.commandMannger.executeCommand(inputArray, commandObj)
    }
    
    // show (status) {
    //     if(status === 'all') {
    //         const countEachStatus = this.model.getCountEachStatus();
    //         this.printer.printShowAllMessage(countEachStatus);
    //         return;
    //     }
    //     const listInStatus = this.model.getListInStatus(status);
    //     this.printer.printShowStatusMessage(status, listInStatus);
    // }
    
    add (name, tag) {
        const objToAdd = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': this.utility.getRandomID()};
        this.model.addTodoObject(objToAdd);
        this.printer.printAddMessage(objToAdd);
        this.throwSetTimeForShowAll();
    }
    
    delete (id) {
        const objToDelete = this.model.deleteTodoObject(id);
        this.printer.printDeleteMessage(objToDelete);
        this.throwSetTimeForShowAll();
    }
    
    update (id, status) {
        const objToUpdate = this.model.updateTodoObject(id, status);   
        this.throwSetTimeForUpdate(objToUpdate);
    }
    
    throwSetTimeForShowAll (delayTime = 1000) {
        setTimeout( () => { this.show('all'); }, delayTime); 
    }
    
    throwSetTimeForUpdate (objToUpdate, delayTime = 3000) { 
        setTimeout( 
            () => { 
                this.printer.printUpdateMessage(objToUpdate);
                this.throwSetTimeForShowAll();
            }, delayTime);
    }
    
}


module.exports = Controller;