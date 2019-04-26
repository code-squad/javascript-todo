const Controller = require('./controller');
const ErrorHandler = require('./errorHandler')
const Printer = require('./printer')
const Utility = require('./utility')
const Model = require('./model')
const readLine = require('readline');

const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    const errorHandler = new ErrorHandler();
    const utility = new Utility();
    const printer = new Printer();
    const model = new Model();

    rl.on('line', (input) => {
        const controller = new Controller(model, utility, printer, errorHandler);
        controller.instruct(input);
    });
})();
