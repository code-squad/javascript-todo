class Validation {
    constructor (utility, view) {
        this.utility = utility;
        this.view = view;
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
                if(!this.sameStatusErrorCheck(id, status)) return false;;
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