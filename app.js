const todos = require('./todos.js');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const getCommandArrayByRegexp = (command) => {
    const regexpForSeperateCommand = /[^\$]+/g;
    return command.match(regexpForSeperateCommand);
};

const executeCommand = (commandArr) => {
    if (commandArr.length == 2) {
        todos[commandArr[0]](commandArr[1]);
    } else if (commandArr.length == 3) {
        todos[commandArr[0]](commandArr[1], commandArr[2]);
    }
};

const isValidCommand = (command) => {
    let result = false;
    if (Object.keys(todos).includes(command)) result = true;
    return result;
}

const delay = (time) => {
    return new Promise(function(resolve, reject){
        setTimeout(resolve, time);
    });
}

const runProgram = (readline) => {

    readline.setPrompt('명령하세요: ');
    readline.prompt();
    readline.on('line', (userInput) => {
        
        try {
            const commandArr = getCommandArrayByRegexp(userInput);
            const primaryCommand = commandArr[0];

            if (!isValidCommand(primaryCommand)) {
                console.log("올바르지 않은 명령어입니다")
                readline.prompt();
            }

            delay(0)
            .then(() => {executeCommand(commandArr); return delay(0)})
            .then(() => {if (primaryCommand != 'show') return delay(2000)})
            .then(() => {if (primaryCommand == 'update') return delay(2500)})
            .then(() => {readline.prompt(); return delay(0)})

        } catch (error) {
            console.log("명령어를 다시 입력해주세요")
            readline.prompt();
        }

    }).on('close', () => {
        console.log("프로그램을 종료합니다.");
        process.exit();
    });
}

runProgram(readline);