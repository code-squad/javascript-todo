class Controller {
    constructor (model, utility, view, validation, commandManager) {
        this.model          = model;
        this.utility        = utility;
        this.view           = view;
        this.validation     = validation;
        this.commandManager = commandManager;
    }

    instruct (input, showCommand, addCommand, deleteCommand, updateCommand) {
        if(!(this.validation.check(input))) return;      
        const inputArray = this.utility.splitInput(input);
        const command = inputArray[0];
        let resultData;
        switch(command) {
            case 'show' :
                resultData = this.commandManager.executeCommand(inputArray, showCommand);
                this.view.printShowMessage(resultData);
                break;
            case 'add' :
                resultData = this.commandManager.executeCommand(inputArray, addCommand);
                this.view.printAddMessage(resultData);
                this.throwSetTimeForShowAll(showCommand);
                break;
            case 'delete':
                resultData = this.commandManager.executeCommand(inputArray, deleteCommand);
                this.view.printDeleteMessage(resultData);
                this.throwSetTimeForShowAll(showCommand);
                break;
            case 'update':
                resultData = this.commandManager.executeCommand(inputArray, updateCommand);
                this.throwSetTimeForUpdate(showCommand, resultData);
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
    
    throwSetTimeForShowAll (showCommand, delayTime = 1000) {
        setTimeout( () => { const resultData = this.commandManager.executeCommand(['show','all'], showCommand); 
                            this.view.printShowMessage(resultData);}, delayTime); 
    }
    
    throwSetTimeForUpdate (showCommand, objToUpdate, delayTime = 3000) { 
        setTimeout( 
            () => { 
                this.view.printUpdateMessage(objToUpdate);
                this.throwSetTimeForShowAll(showCommand);
            }, delayTime);
    }
}


module.exports = Controller;