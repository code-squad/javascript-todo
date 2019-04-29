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
const todoList = require('./todo.json')

//const Managers = require('./managers')
const rl = readLine.createInterface({
    input:process.stdin,
});

// (() => {
//     const model          = new Model(utility, todoList);
//     const validation     = new Validation(utility, view);
//     const addManager     = new AddManager(model, utility, todoList);
//     const showManager    = new ShowManager(model);
//     const deleteManager  = new DeleteManager(model);
//     const updateManager  = new UpdateManager(model);
//     const commandManager = new CommandManager(addManager, deleteManager, updateManager);

    
//     const controller     = new Controller(model, utility, view, validation, commandManager);
    
//      rl.on('line', (input) => {
//     controller.instruct(input, showManager, addManager, deleteManager, updateManager);
//      });
//  })();


function test (input) {
    const model          = new Model(utility, todoList);
    const validation     = new Validation(utility, view);
    const showManager    = new ShowManager(model);
    const addManager     = new AddManager(model, todoList, utility);
    const deleteManager  = new DeleteManager(model, todoList, utility);
    const updateManager  = new UpdateManager(model, todoList, utility);
    const commandManager = new CommandManager(addManager, deleteManager, updateManager);

    
    const controller     = new Controller(model, utility, view, validation, commandManager);
    
    // controller.instruct(input, showManager, addManager, deleteManager, updateManager);
    // controller.instruct('add$sleep1$["favorite"]', showManager, addManager, deleteManager, updateManager);
    // controller.instruct('add$sleep2$["favorite"]', showManager, addManager, deleteManager, updateManager);
    controller.instruct('update$1556541975744$doing', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('delete$1556541975740', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('delete$1556541975744', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('delete$82579386', showManager, addManager, deleteManager, updateManager);
     //controller.instruct('add$sleep$["favorite"]', showManager, addManager, deleteManager, updateManager);
     //controller.instruct('add$sleep2$["favorite"]', showManager, addManager, deleteManager, updateManager);
     controller.instruct('undo', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('undo', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('undo', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('undo', showManager, addManager, deleteManager, updateManager);
    //controller.instruct('undo', showManager, addManager, deleteManager, updateManager);
    
    controller.instruct('redo', showManager, addManager, deleteManager, updateManager);

}
test();
// // 
// //test('show$all');
// // test('show$done');
// // test('show$todo');
// // test('show$doing');
// // test('delete$1556520122671');
// //test('update$3882$done');

// // test('asdjlfkadjsflkads');
// // test('delete$3882123123123');
// // test('update$3882123123123$done');
// // test('update$3882$done');
//test();