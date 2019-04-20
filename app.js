const data = require('./database.json');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const todo_shell = {

    todoObjectTemplate: {
        name: "",
        category: "",
        status: "",
        id: "",
        deadline: "",
    },


    showCurrentStatus: function(){
        const resultObj = data.map(el=>el.status)
        .reduce((accum,curr)=>{
            accum[curr] = ++accum[curr] || 1;
            return accum;
        },{});
        
        const result = Object.keys(resultObj).reduce((accum,curr)=>{
            accum.push(`${curr}은 ${resultObj[curr]}임`);
            return accum;
        },[]).join(",")

        console.log(result);
    },

    showFilteredTodo : function(_filteredData){
        const totalCount = _filteredData.length;
        const resultTodoList = _filteredData.reduce((accum,curr)=>{
            accum.push(`${curr.name}`)
            return accum
        },[]).join(", ");
        console.log(`todo리스트 총${totalCount}건 : ${resultTodoList}`)
    },

    filterArg: function(...arg){
        if (arg[0] === "all") { return data }
        return data.filter(todo =>
            todo[arg[0]] === arg[1]
        )
    },

    showTodo: function (...arg) {
        const filteredData = todo_shell.filterArg(...arg)
        
        if(filteredData === data){todo_shell.showCurrentStatus()}
        else {
            todo_shell.showFilteredTodo(filteredData);
        }

        rl.prompt();

        
    },


    addTodo: function (...arg) {
        const keyArg = arg[0].split(",");
        const valueArg = arg[1].split(",");
        if (keyArg.length !== valueArg.length) throw new Error("키와 값의 갯수가 맍지 않습니다.");
        const addTodoObj = JSON.parse(JSON.stringify(todo_shell.todoObjectTemplate))
        // const addTodoObj = todo_shell.todoObjectTemplate;
        for (let i = 0; i < keyArg.length; i++) {
            addTodoObj[keyArg[i]] = valueArg[i];
        }

        addTodoObj.id = todo_shell.getHashCode(valueArg[0]);
        data.push(addTodoObj);
        
        console.log(`${addTodoObj.name} 1개가 추가되었습니다. (id :${addTodoObj.id})`);
        setTimeout(()=>{
            todo_shell.syncronizecDatabase();
            todo_shell.showCurrentStatus();
            rl.prompt();
        },1000)

    },
    updateTodo: function (objId, objKey, objValue) {
        const updatedData = data.filter(v=>v.id === parseInt(objId));

        data.forEach((v, i) => {
            if (v.id === parseInt(objId)) {
                v[objKey] = objValue;
            }
        });

        console.log(`${updatedData[0].name}의 ${objKey}가 ${objValue}로 변경되었습니다.`);
        setTimeout(()=>{
            setTimeout(()=>{
                todo_shell.syncronizecDatabase();
                todo_shell.showCurrentStatus();
                rl.prompt();
            },1000)
        },3000)



    },
    deleteTodo: function (objId, ...arg) {
        
        const deletedData = data.filter(v=>v.id === parseInt(objId));
        data.forEach((v, i) => {
            if (v.id === parseInt(objId)) {
                data.splice(i, 1);
            }
        });

        console.log(`${deletedData[0].name}가 목록에서 삭제되었습니다.`);
        setTimeout(()=>{
            todo_shell.syncronizecDatabase();
            todo_shell.showCurrentStatus();
            rl.prompt();
        },1000)
        
    },

    getHashCode: function (inputString) {
        return Math.abs((inputString + Date.now()).split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
    },

    parseCommand: function (inputArg) {
        [commandArg, ...deliveryArg] = inputArg.split("$");
        return todo_shell[commandArg+"Todo"](...deliveryArg);
        // todo_shell.COMMAND_DICT[commandArg](...deliveryArg);
    },

    // COMMAND_DICT:{
    //     show:todo_shell.showTodo,
    //     add:todo_shell.addTodo,
    //     delete:todo_shell.deleteTodo,
    //     update:todo_shell.updateTodo,
    // },

    syncronizecDatabase: function () {
        let syncData = JSON.stringify(data, null, 2);
        fs.writeFile('./database.json', syncData, (err) => {
            if (err) throw err;
        });
    },
    
    run: function(){

        rl.setPrompt('명령하세요 : ');
        rl.prompt();


          rl.on('line', (input) => {

              if(input === "exit") return rl.close()

              todo_shell.parseCommand(input);
            //   todo_shell.showCurrentStatus() 여기에 넣고 싶은데 어떻게 수정해야할지 모르겠음. 
        
            
          });
    }
}


// todo_shell.parseCommand("show$all");
// // log(todo_shell.parseCommand("show$status$todo"));
// todo_shell.parseCommand("add$name,status,category$과제끝내기,doing,wannabe");
// todo_shell.parseCommand("update$1$status$done");
// todo_shell.parseCommand("delete$7");


todo_shell.run();