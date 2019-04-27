//app.js
const Todos = require('./todos');
const InputParser = require('./inputParser');
const Validator = require('./validator');

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const originData = require('./todoList.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;

const todos = new Todos(convertedData);
const validator = new Validator(convertedData);
const inputParser = new InputParser();


const promptResult = (resultOfTodos, appWord) => {
    return new Promise((resolve) => {
        let timeDelay = 0;
        if (appWord === 'update')
            timeDelay = 3000;
        setTimeout(() => {
            resolve(resultOfTodos);
        }, timeDelay);
    });
};

const promptAll = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(todos.show('all'));
        }, 1000);
    });
};

rl.setPrompt('명령하세요: ');
rl.prompt();
rl.on('line', (userInput) => {
    switch (userInput.toLowerCase().trim()) {
        case 'exit':
            rl.close();
            break;
        default:
            const errorMessage = validator.excuteValidation(userInput);
            if (errorMessage) {
                console.log(errorMessage);
                rl.prompt();
            } else {
                const resultMessage = inputParser.executeTodos(todos, userInput);
                const appWord = inputParser.appWord;
                promptResult(resultMessage, appWord)
                .then((resultOfTodos) => {
                    console.log(resultOfTodos);
                    if (appWord !== 'show') {
                        promptAll()
                        .then((resultOfAll) => {
                            console.log(resultOfAll);
                            rl.prompt();
                        });
                    } else rl.prompt();
                });
            }
    }
}).on('close', () => {
    console.log("프로그램을 종료합니다.");
    process.exit();
});
