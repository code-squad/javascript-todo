let readline = require('readline');

let inputReadline = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

let todoList = require('./todo-proto.js');

let todoTest = new todoList();

inputReadline.setPrompt('명령하세요');
inputReadline.prompt();
inputReadline.on('line', (line) => {
    
    if(line === 'exit') {
        r.close();
    }

    todoTest.checkInput(line, inputReadline);
    // r.prompt();
})
inputReadline.on('close', function(){
    process.exit();
})


