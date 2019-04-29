class Validation {
    constructor (utility, view) {
        this.utility = utility;
        this.view = view;
    }

    check (input) {
        if(!this.usageErrorCheck(input)) return false;
        const inputArray = this.utility.splitInput(input);
        const command = inputArray[0];
        const id = inputArray[1];
        if(!this.notExistIdErrorCheck(id)) return false;
        if(command === 'update') {
            const status = inputArray[2];
            if(!this.sameStatusErrorCheck(id, status)) return false;;
        }
        return true;
    }

    usageErrorCheck (input) {
        if(!(input.match(/\$/))) {
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