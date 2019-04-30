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

const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    const model          = new Model(utility, todoList);
    const showManager    = new ShowManager(model);
    const addManager     = new AddManager(model, todoList, utility);
    const deleteManager  = new DeleteManager(model, todoList, utility);
    const updateManager  = new UpdateManager(model, todoList, utility);
    const commandManager = new CommandManager(addManager, deleteManager, updateManager);
    const validation     = new Validation(utility, view, commandManager);
    const controller     = new Controller(model, utility, view, validation, commandManager);
    
     rl.on('line', (input) => {
        controller.instruct(input, showManager, addManager, deleteManager, updateManager);
     });
 })();