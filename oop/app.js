//app.js

const Todos = require('./todos');
const InputParser = require('./inputParser');
const Utils = require('./utils');

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const originData = require('./todoList.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;

todos = new Todos(convertedData);

const showResult = (appWord, inputParaArr) => {
    return new Promise((resolve) => {
        let timeDelay = 0;
        if (appWord === 'update')
            timeDelay = 3000;
        setTimeout(() => {
            resolve(todos[appWord].apply(todos, inputParaArr));
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
    if (!fun) rl.prompt();
};


rl.setPrompt('명령하세요: ');
rl.prompt();

rl.on('line', (userInput) => {
    switch (userInput.toLowerCase().trim()) {
        case 'q':
            rl.close();
            break;
        default:
            // const utils = new Utils(convertedData, userInput);
            // promptRepeater(utils.validator());

            const inputParser = new InputParser(userInput);
            const appWord = inputParser.first;
            const inputParaArr = inputParser[appWord]();

            showResult(appWord, inputParaArr)
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
