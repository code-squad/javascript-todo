const Controller     = require('./controller')
const Validation     = require('./validation')
const Model          = require('./model')
const utility        = require('./utility')
const view           = require('./view')
const readLine       = require('readline')
const CommandManager = require('./commandManager')
const ShowCommand    = require('./showCommand')
const AddCommand     = require('./addCommand')
const DeleteCommand  = require('./deleteCommand')
const UpdateCommand  = require('./updateCommand')
const todoList       = require('./todo.json')

const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    const model          = new Model(utility, todoList);
    const showCommand    = new ShowCommand(model);
    const addCommand     = new AddCommand(model, todoList, utility);
    const deleteCommand  = new DeleteCommand(model, todoList, utility);
    const updateCommand  = new UpdateCommand(model, todoList, utility);
    const commandManager = new CommandManager(addCommand, deleteCommand, updateCommand);
    const validation     = new Validation(utility, view, commandManager);
    const controller     = new Controller(model, utility, view, validation, commandManager);
    
     rl.on('line', (input) => {
        controller.instruct(input, showCommand, addCommand, deleteCommand, updateCommand);
     });
 })();

//  function test() {
//     const model          = new Model(utility, todoList);
//     const showCommand    = new ShowCommand(model);
//     const addCommand     = new AddCommand(model, todoList, utility);
//     const deleteCommand  = new DeleteCommand(model, todoList, utility);
//     const updateCommand  = new UpdateCommand(model, todoList, utility);
//     const commandManager = new CommandManager(addCommand, deleteCommand, updateCommand);
//     const validation     = new Validation(utility, view, commandManager);
//     const controller     = new Controller(model, utility, view, validation, commandManager);
    
//     controller.instruct('add$sleep$["f"]', showCommand, addCommand, deleteCommand, updateCommand);
//     controller.instruct('add$sleep$["f"]', showCommand, addCommand, deleteCommand, updateCommand);
//     controller.instruct('add$sleep$["f"]', showCommand, addCommand, deleteCommand, updateCommand);
//     controller.instruct('undo', showCommand, addCommand, deleteCommand, updateCommand);
//     // controller.instruct('undo', showCommand, addCommand, deleteCommand, updateCommand);
//     // controller.instruct('undo', showCommand, addCommand, deleteCommand, updateCommand);
//     // controller.instruct('undo', showCommand, addCommand, deleteCommand, updateCommand);
//  }

//   test();