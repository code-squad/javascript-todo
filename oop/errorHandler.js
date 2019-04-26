function ErrorHandler(printer, utility) {
    this.printer = printer;
    this.utility = utility;
}

ErrorHandler.prototype.usageErrorCheck = function (input) {
    if(!(input.match(/\$/))) {
        this.printer.printUsage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.notExistIdErrorCheck = function (idDelete) {
    if(!(this.utility.getObjectById(idDelete))) {
        this.printer.printNotExistErrorMessage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.sameStatusErrorCheck = function (idUpdate, statusToChange) {
    if(this.utility.getObjectById(idUpdate).status === statusToChange) {
        this.printer.printSameStatusErrorMessage();
        return false;
    }
    return true;
}

module.exports = ErrorHandler;