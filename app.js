const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const TodoUtil = require('./todoUtil');
const Model = require('./model');
const View = require('./view');
const Controller = require('./controller');
const ErrorHandler = require('./errorHandler');

const fontColorRed = '\x1b[31m%s\x1b[0m';
const fontColorBlue = '\x1b[36m%s\x1b[0m';
const ID_LENGTH = 4;
const UPDATE_DELAY = 3000;
const SHOW_DELAY = 1000;
const MAX_HISTORY_CAPACITY = 3;
const initialData = [];

const util = new TodoUtil();
const model = new Model(initialData, MAX_HISTORY_CAPACITY);
const view = new View(fontColorBlue);
const controller = new Controller(model, view, UPDATE_DELAY, SHOW_DELAY);
const errorHandler = new ErrorHandler(controller, fontColorRed, ID_LENGTH);

const app = {
    util: util,
    controller: controller,
    errorHandler: errorHandler,
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ');
        rl.prompt();
        rl.on('line', async (command) => {
            if (command === 'q') rl.close();
            try {
                command = this.util.parseCommand(command)
                const keyCommand = this.util.getKeyCommand(command);
                const restCommand = command;
                this.util.checkArgsNumber(keyCommand, restCommand);
                await this.controller[keyCommand](...restCommand);
            }
            catch (e) {
                this.errorHandler.printErrorMessage(e.message);
            }
            finally {
                rl.prompt();
            }
        })
        rl.on('close', () => {
            process.exit();
        })
    }
}

app.start();