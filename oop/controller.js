class Controller {
    constructor (model, utility, view, errorHandler, commandManager) {
        this.model          = model;
        this.utility        = utility;
        this.view           = view;
        this.errorHandler   = errorHandler;
        this.commandManager = commandManager;
    }

    instruct (input, showManager, addManager, deleteManager) {
        if(!(this.errorHandler.usageErrorCheck(input))) return;
        const inputArray = this.utility.splitInput(input);
        const command = inputArray[0];
        let resultData;
        switch(command) {
            case 'show' :
                resultData = this.commandManager.executeCommand(inputArray, showManager);
                this.view.printShowMessage(resultData);
                break;
            case 'add' :
                resultData = this.commandManager.executeCommand(inputArray, addManager);
                this.view.printAddMessage(resultData);
                this.throwSetTimeForShowAll(showManager);
                break;
            case 'delete':
                resultData = this.commandManager.executeCommand(inputArray, deleteManager);
                this.view.printDeleteMessage(resultData);
                this.throwSetTimeForShowAll(showManager);
                break;
            // case 'update':
            //     this.commandManager.executeCommand(inputArray, updateManager);
            //     break;
        }
    }
    
    update (id, status) {
        const objToUpdate = this.model.updateTodoObject(id, status);   
        this.throwSetTimeForUpdate(objToUpdate);
    }
    
    throwSetTimeForShowAll (showManager, delayTime = 1000) {
        setTimeout( () => { const resultData = this.commandManager.executeCommand(['show','all'], showManager); 
                            this.view.printShowMessage(resultData);}, delayTime); 
    }
    
    throwSetTimeForUpdate (objToUpdate, delayTime = 3000) { 
        setTimeout( 
            () => { 
                this.view.printUpdateMessage(objToUpdate);
                this.throwSetTimeForShowAll();
            }, delayTime);
    }
}


module.exports = Controller;