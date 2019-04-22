const todoList = require('./todoApp');
const checkCommands = todoList.checkCommands;

const readline = require('readline');
const inputReadline = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요)');
inputReadline.prompt();
inputReadline.on('line', function (line) {
    
    if(line === "q") inputReadline.close();
    checkCommands(line, inputReadline);
 })

 .on('close', function () {
   console.log('프로그램이 종료되었습니다.');
   process.exit();
});
