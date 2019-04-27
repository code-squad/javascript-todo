//app.js
const Todos = require('./todos');
const InputParser = require('./inputParser');
const Validator = require('./validator');

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const originData = require('./todoList.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;

todos = new Todos(convertedData);

const promptResult = (resultOfTodos, appWord) => {
    return new Promise((resolve) => {
        let timeDelay = 0;
        if (appWord === 'update')
            timeDelay = 3000;
        setTimeout(() => {
            resolve(resultOfTodos);
        }, timeDelay);
    })
};

const promptAll = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(todos.show('all'));
        }, 1000);
    })
};

const promptRepeater = (func) => {
    if (func) {
        rl.prompt();
        return true;
    }
};

rl.setPrompt('명령하세요: ');
rl.prompt();

rl.on('line', (userInput) => {
    switch (userInput.toLowerCase().trim()) {
        case 'exit':
            rl.close();
            break;
        default:
            const validator = new Validator(convertedData, userInput);
            if (promptRepeater(validator.execute())) return;

            const inputParser = new InputParser(userInput);
            const appWord = inputParser.splitedOrder[0];

            promptResult(inputParser.execute(todos), appWord)
            .then((resultOfTodos) => {
                console.log(resultOfTodos);
                if (appWord != 'show') {
                    promptAll()
                    .then((resultOfAll) => {
                        console.log(resultOfAll);
                        rl.prompt();
                    })
                } else rl.prompt();
            })
    }
}).on('close', () => {
    console.log("프로그램을 종료합니다.");
    process.exit();
});