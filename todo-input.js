let readline = require('readline');

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

let todoList = require('./todo_proto.js');

let todoTest = new todoList();

r.setPrompt('명령하세요');
r.prompt();
r.on('line', (line) => {
    
    if(line === 'exit') {
        r.close();
    }

    todoTest.sortItem(line);
    r.prompt();
})
r.on('close', function(){
    process.exit();
})


