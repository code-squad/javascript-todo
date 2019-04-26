//app.js

const Todos = require('./todos');
const InputParser = require('./inputParser');
const Validator = require('./validator');

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const originData = require('./todoList.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;

todos = new Todos(convertedData);

const showResult = (todosReturn, appWord) => {
    return new Promise((resolve) => {
        let timeDelay = 0;
        if (appWord === 'update')
            timeDelay = 3000;
        setTimeout(() => {
            resolve(todosReturn);
        }, timeDelay);
    })
};
const showAll = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(todos.show('all'));
        }, 1000);
    })
};
const promptRepeater = (fun) => {
    if (fun) {
        rl.prompt();
        return true;
    }
};


rl.setPrompt('명령하세요: ');
rl.prompt();

rl.on('line', (userInput) => {
    switch (userInput.toLowerCase().trim()) {
        case 'q':
            rl.close();
            break;
        default:
            const validator = new Validator(convertedData, userInput);
            if (promptRepeater(validator.excute())) return;

            const inputParser = new InputParser(userInput);
            const appWord = inputParser.splitedOrder[0];

            showResult(inputParser.excute(todos), appWord)
                .then((textResult) => {
                    console.log(textResult);
                    if (appWord != 'show') {
                        showAll()
                            .then((textAll) => {
                                console.log(textAll);
                                rl.prompt();
                            })
                    } else rl.prompt();
                })
    }
}).on('close', () => {
    console.log("프로그램을 종료합니다.");
    process.exit();
});
