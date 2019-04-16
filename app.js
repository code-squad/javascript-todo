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
        name = commandArray[1];  
        tag = commandArray[2];
        
        myTodoList.add(name,tag);

    }else if(action === "delete"){
        id = parseInt(commandArray[1]);
        myTodoList.deleteData(id);
    
    }else if(action === "update"){
        id =  parseInt(commandArray[1]);
        status = commandArray[2];

        myTodoList.updateData(id,status);
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

