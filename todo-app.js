const readline = require('readline');

const inputReadline = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const TodoList = require('./todo-main.js');

const todoTest = new TodoList();

inputReadline.on('line', (line) => {
    
    if(line === 'exit') {
        r.close();
    }

    todoTest.checkInput(line);
})
inputReadline.on('close', function(){
    process.exit();
})


