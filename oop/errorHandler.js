const Printer = require('./printer');
const Finder = require('./finder')

module.exports = function ErrorHandler() {
    const printer = new Printer();
    const finder = new Finder();

    this.usageErrorCheck = (input) => {
        if(!(input.match(/\$/))) {
            printer.printUsage();
            return false;
        }
        return true;
    }

    this.notExistIdErrorCheck = (idDelete) => {
        if(!(finder.getObjectById(idDelete))) {
            printer.printNotExistErrorMessage();
            return false;
        }
        return true;
    }
    
    this.sameStatusErrorCheck = (idUpdate, statusToChange) => {
        if(finder.getObjectById(idUpdate).status === statusToChange) {
            printer.printSameStatusErrorMessage();
            return false;
        }
        return true;
    }
}

