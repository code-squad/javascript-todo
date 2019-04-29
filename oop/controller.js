class Controller {
    constructor (model, utility, view, validation, commandManager) {
        this.model          = model;
        this.utility        = utility;
        this.view           = view;
        this.validation     = validation;
        this.commandManager = commandManager;
    }

    instruct (input, showManager, addManager, deleteManager, updateManager) {
        if(!(this.validation.check(input))) return;      
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
            case 'update':
                resultData = this.commandManager.executeCommand(inputArray, updateManager);
                this.throwSetTimeForUpdate(showManager, resultData);
                break;
            case 'undo' :
                resultData = this.commandManager.undo();
                this.view.printUndoMessage(resultData[0], resultData[1]);
                break;
            case 'redo' :
                resultData = this.commandManager.redo();
                this.view.printRedoMessage(resultData[0], resultData[1]);
                break;
        }
    }
    
    throwSetTimeForShowAll (showManager, delayTime = 1000) {
        setTimeout( () => { const resultData = this.commandManager.executeCommand(['show','all'], showManager); 
                            this.view.printShowMessage(resultData);}, delayTime); 
    }
    
    throwSetTimeForUpdate (showManager, objToUpdate, delayTime = 3000) { 
        setTimeout( 
            () => { 
                this.view.printUpdateMessage(objToUpdate);
                this.throwSetTimeForShowAll(showManager);
            }, delayTime);
    }
}


module.exports = Controller;