const Printer = require('./printer')
const Finder = require('./finder')

const printer = new Printer();
const finder = new Finder();

function ErrorHandler() {}

ErrorHandler.prototype.usageErrorCheck = function (input) {
    if(!(input.match(/\$/))) {
        printer.printUsage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.notExistIdErrorCheck = function (idDelete) {
    if(!(finder.getObjectById(idDelete))) {
        printer.printNotExistErrorMessage();
        return false;
    }
    return true;
}

ErrorHandler.prototype.sameStatusErrorCheck = function (idUpdate, statusToChange) {
    if(finder.getObjectById(idUpdate).status === statusToChange) {
        printer.printSameStatusErrorMessage();
        return false;
    }
    return true;
}

module.exports = ErrorHandler;