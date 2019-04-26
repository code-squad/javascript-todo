function ErrorHandler(utility, printer) {
    this.utility = utility;
    this.printer = printer;
}

ErrorHandler.prototype.usageErrorCheck = function (input) {
    if(!(input.match(/\$/))) {
        this.printer.printUsageErrorMessage();
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