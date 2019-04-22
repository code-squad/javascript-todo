const { log } = console;
const todoList = require("./todo");
const myTodoList = new todoList();

const getCommand = () => {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("line", line => {
        const commandArray = line.split("$");
        executeCommand(commandArray);
    }).on("close", () => {
        process.exit();
    });
}


const executeCommand = (commandArray) => {
    const action = commandArray[0];
    commandArray.shift();
    const commandParameters = commandArray;
    const actionReg = /^show$|^add$|^delete$|^update$/;
    let actionMatchResult = action.match(actionReg);
    if(actionMatchResult === null){
        log('명령어가 올바르지 않습니다.');
        return ;
    }
    try {
        myTodoList[`${actionMatchResult[0]}Data`](...commandParameters);
    } catch (error) {
        log(error);
    }
};

const main = () => {
    getCommand();
}

main();
