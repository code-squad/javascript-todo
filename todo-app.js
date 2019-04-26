const readline = require('readline');

const inputReadline = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const TodoList = require('./todo-proto.js');

const todoTest = new TodoList();

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


