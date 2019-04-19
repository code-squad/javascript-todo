let readline = require('readline');

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

let todoMainFunction = require('./todo-func.js');

r.setPrompt('명령하세요');
r.prompt();
r.on('line', (line) => {
    
    if(line === 'exit') {
        r.close();
    }

    todoMainFunction.todoMain(line);
    r.prompt();
})
r.on('close', function(){
    process.exit();
})


