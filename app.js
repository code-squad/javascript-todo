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
const initialData = [];

const util = new TodoUtil();
const model = new Model(initialData);
const view = new View(fontColorBlue);
const controller = new Controller(model, view);
const errorHandler = new ErrorHandler(controller, fontColorRed);

const app = {
    util: util,
    controller: controller,
    errorHandler: errorHandler,
    start() {
        rl.setPrompt('명령하세요(종료하려면 "q"를 입력하세요) : ')
        rl.prompt()
        rl.on('line', (command) => {
            if (command === 'q') rl.close()
            try {
                command = this.util.parseCommand(command)
                const keyCommand = this.util.getKeyCommand(command);
                const restCommand = command;
                this.util.checkArgsNumber(keyCommand, restCommand);
                this.controller[keyCommand](...restCommand);
            }
            catch (e) {
                console.log(e, e.message)
                const errorType = this.errorHandler.getErrorType(e.message)
                if (errorType) {
                    this.errorHandler[errorType](e.message)
                    rl.prompt()
                } else {
                    this.errorHandler.printOtherErrors();
                    rl.prompt()
                }
            }
        })
        rl.on('close', () => {
            process.exit()
        })
    }
}

app.start()