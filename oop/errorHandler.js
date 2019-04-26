const Printer = require('./printer')
const Utility = require('./utility')

const printer = new Printer();
const utility = new Utility();

function ErrorHandler() {}

ErrorHandler.prototype.usageErrorCheck = function (input) {
    if(!(input.match(/\$/))) {
        printer.printUsage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.notExistIdErrorCheck = function (idDelete) {
    if(!(utility.getObjectById(idDelete))) {
        printer.printNotExistErrorMessage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.sameStatusErrorCheck = function (idUpdate, statusToChange) {
    if(utility.getObjectById(idUpdate).status === statusToChange) {
        printer.printSameStatusErrorMessage();
        return false;
    }
    return true;
}

module.exports = ErrorHandler;