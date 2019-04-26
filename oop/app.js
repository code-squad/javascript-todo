const Controller    = require('./controller')
const ErrorHandler  = require('./errorHandler')
const Printer       = require('./printer')
const Model         = require('./model')
const readLine      = require('readline')
const utility       = require('./utility')

const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    // const utility       = new Utility();
    const printer       = new Printer();
    const model         = new Model(utility);
    const errorHandler  = new ErrorHandler(printer, utility);
    const controller    = new Controller(model, utility, printer, errorHandler);

    rl.on('line', (input) => {
        controller.instruct(input);
    });
})();
