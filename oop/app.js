const Controller    = require('./controller')
const ErrorHandler  = require('./errorHandler')
const Model         = require('./model')
const utility       = require('./utility')
const printer       = require('./printer')
const readLine      = require('readline')

const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    const model         = new Model(utility);
    const errorHandler  = new ErrorHandler(utility, printer);
    const controller    = new Controller(model, utility, printer, errorHandler);

    rl.on('line', (input) => {
        controller.instruct(input);
    });
})();
