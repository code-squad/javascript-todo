const todoList = require("./todo");
const myTodoList = new todoList();


const getCommand = () =>{
    const readline = require("readline");
    const rl = readline.createInterface({
        input : process.stdin,
        output: process.stdout
    });
       
    
    rl.on("line", function(line){

        // rl.close();
        const commandArray = line.split("$");
        executeCommand(commandArray);
    }).on("close", function() {
        process.exit();
    });
}


const executeCommand = (commandArray) => {
    const action = commandArray[0];
    if(action === "show"){
        myTodoList.show(commandArray[1]);
    }else if(action === "add"){
        // name = commandArray[1];
        // tag = commandArray[2];

        // add(name,tag);
        console.log(`add ${commandArray[1]}, ${commandArray[2]}`);
    }else if(action === "delete"){
        // id = commandArray[1];

        // delete(id);
        console.log(`delete ${commandArray[1]}`);
    }else if(action === "update"){
        // id = commandArray[1];
        // status = commandArray[2];

        // update(id,status);
        console.log(`update ${commandArray[1]}, ${commandArray[2]}`);
    }else{
        console.log("명령어가 유효하지 않습니다.");
    }
}

const main = () => {
    getCommand();
}

main();






// myTodoList.show("all");
// myTodoList.show("todo");
// myTodoList.show("doing");
// myTodoList.show("done");

