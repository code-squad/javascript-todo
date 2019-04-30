class Validation {
    constructor (utility, view, commandManager) {
        this.utility = utility;
        this.view = view;
        this.commandManager = commandManager;
    }

    check (input) {
        if(!this.usageErrorCheck(input)) return false;
        const inputArray = this.utility.splitInput(input);
        const [command, id, status] = inputArray;

        switch (command) {
            case 'delete' :
                if(!this.notExistIdErrorCheck(id)) return false;
                break;
            case 'update' :
                if(!this.notExistIdErrorCheck(id)) return false;
                if(!this.sameStatusErrorCheck(id, status)) return false;
                break;
            case 'undo' :
                if (this.commandManager.commandPointer === -1) {
                    this.view.printUndoErrorMessage();
                    return false;
                }
                break;
            case 'redo' :
                if (this.commandManager.undoStackPointer === -1) {
                    this.view.printRedoErrorMessage();
                    return false;
                }
                break;
        }
    
        return true;
    }

    usageErrorCheck (input) {
        if(!(input.match(/\$|redo|undo/))) {
            this.view.printUsageErrorMessage();
            return false;
        }
        return true;
    }

    notExistIdErrorCheck (idDelete) {
        if(!(this.utility.getObjectById(idDelete))) {
            this.view.printNotExistErrorMessage();
            return false;
        }
        return true;
    }

    sameStatusErrorCheck (idUpdate, statusToChange) {
        if(this.utility.getObjectById(idUpdate).status === statusToChange) {
            this.view.printSameStatusErrorMessage();
            return false;
        }
        return true;
    }
}

module.exports = Validation;