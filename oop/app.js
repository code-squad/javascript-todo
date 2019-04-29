const Controller    = require('./controller')
const ErrorHandler  = require('./errorHandler')
const Model         = require('./model')
const utility       = require('./utility')
const printer       = require('./printer')
const readLine      = require('readline')
const CommandManager = require('./commandManager')
const ShowManager   = require('./showManager')
const AddManager    = require('./addManager')
const DeleteManager = require('./deleteManager');
//const Managers = require('./managers')
const rl = readLine.createInterface({
    input:process.stdin,
});

// (() => {
//     const model         = new Model(utility);
//     const errorHandler  = new ErrorHandler(utility, printer);
//     const controller    = new Controller(model, utility, printer, errorHandler);

//     rl.on('line', (input) => {
//         if(!showManager) const showManager = new ShowManager();
//         // if(!showManager) const showManager = ShowManager();
//         // if(!showManager) const showManager = ShowManager();
//         controller.instruct(input, showManager);
//     });
// })();


function test (input) {
    const model          = new Model(utility);
    const errorHandler   = new ErrorHandler(utility, printer);
    const commandManager = new CommandManager();
    const showManager    = new ShowManager(model, printer);
    const addManager     = new AddManager(model, printer, utility);
    const deleteManager  = new DeleteManager(model, printer);
    const controller     = new Controller(model, utility, printer, errorHandler, commandManager);
    
    controller.instruct(input, showManager, addManager, deleteManager);
}

// test('show$all');
// test('show$done');
// test('show$todo');
// test('show$doing');
// test('add$sleep$["favorite"]')
test('delete$1599');
