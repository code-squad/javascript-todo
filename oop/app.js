const Controller    = require('./controller')
const Validation    = require('./validation')
const Model         = require('./model')
const utility       = require('./utility')
const view          = require('./view')
const readLine      = require('readline')
const CommandManager = require('./commandManager')
const ShowManager   = require('./showManager')
const AddManager    = require('./addManager')
const DeleteManager = require('./deleteManager');
const UpdateManager = require('./updateManager');

//const Managers = require('./managers')
const rl = readLine.createInterface({
    input:process.stdin,
});

// (() => {
//     const model         = new Model(utility);
//     const errorHandler  = new ErrorHandler(utility, view);
//     const controller    = new Controller(model, utility, view, errorHandler);

//     rl.on('line', (input) => {
//         if(!showManager) const showManager = new ShowManager();
//         // if(!showManager) const showManager = ShowManager();
//         // if(!showManager) const showManager = ShowManager();
//         controller.instruct(input, showManager);
//     });
// })();


function test (input) {
    const model          = new Model(utility);
    const validation   = new Validation(utility, view);
    
    const commandManager = new CommandManager(validation);
    const showManager    = new ShowManager(model);
    const addManager     = new AddManager(model, utility);
    const deleteManager  = new DeleteManager(model);
    const updateManager  = new UpdateManager(model);
    
    const controller     = new Controller(model, utility, view, validation, commandManager);
    
    controller.instruct(input, showManager, addManager, deleteManager, updateManager);
}
// 
// test('show$all');
// test('show$done');
// test('show$todo');
// test('show$doing');
//test('add$sleep$["favorite"]')
// test('delete$1556520122671');
//test('update$3882$done');

test('asdjlfkadjsflkads');
test('delete$3882123123123');
test('update$3882123123123$done');
test('update$3882$done');