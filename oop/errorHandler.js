class ErrorHandler {
    constructor (utility, printer) {
        this.utility = utility;
        this.printer = printer;
    }

    usageErrorCheck (input) {
        if(!(input.match(/\$/))) {
            this.printer.printUsageErrorMessage();
            return false;
        }
        return true;
    }

    notExistIdErrorCheck (idDelete) {
        if(!(this.utility.getObjectById(idDelete))) {
            this.printer.printNotExistErrorMessage();
            return false;
        }
        return true;
    }

    sameStatusErrorCheck (idUpdate, statusToChange) {
        if(this.utility.getObjectById(idUpdate).status === statusToChange) {
            this.printer.printSameStatusErrorMessage();
            return false;
        }
        return true;
    }
}

module.exports = ErrorHandler;