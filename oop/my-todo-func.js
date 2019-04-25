let readline = require('readline');

let r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const todoList = [
    { name: 'asdf1', tag: [ 'asdf' ], status: 'todo', id: 9547 },
    { name: 'asdf2', tag: [ 'asdf' ], status: 'todo', id: 9546 },
    { name: 'asdf3', tag: [ 'asdf' ], status: 'todo', id: 9545 },
    { name: 'asdf4', tag: [ 'asdf' ], status: 'todo', id: 9544 }
];

const todoForm = (name, tag, status, id) => {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}

const showPrint = (value1, value2, value3) => {
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
}

showPrint.prototype.printShowAll = () => {
    console.log(`현재 상태 : todo: ${this.value1}개, doing: ${this.value2}개, done: ${this.value3}개`)
}
showPrint.prototype.printShowElse = () => {
    console.log(`${this.value1}리스트 : 총 ${this.value2}건 : ${this.value3}`);
}
showPrint.prototype.printAdd = () => {
    console.log(`${this.value1} 1개가 추가됐습니다. (id : ${this.value2})`);
}
showPrint.prototype.printUpdate = () => {
    console.log(`${this.value1} 가 ${this.value2}상태로 변경되었습니다.`);
}
showPrint.prototype.printDelete = () => {
    console.log(`${this.value1} 가 todo에서 삭제되었습니다.`)
}




const todoShow = (input) => {
    let status = input[0];
    status === 'all' ? todoShowAll() : todoShowElse(status);
}

const todoShowAll = () => {
    let todo = todoList.filter(v => v.status === 'todo').length;
    let doing = todoList.filter(v => v.status === 'doing').length;
    let done = todoList.filter(v => v.status === 'done').length;

    const Print = new showPrint(todo, doing, done);
    Print.printShowAll();
}

const todoShowElse = (input) => {
    let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})

    const Print = new showPrint(temp.length, temp);
    Print.printShowElse();
}

const showAllTimer = (input) => {
    setTimeout(todoShowAll, input);
}


// add
const todoAdd = (input) => {
    let [name, tag] = input;
    let id = makingID();
    let newTodoList = new todoForm(name, tag, 'todo', id);
    todoList.push(newTodoList);
    
    const Print = new showPrint(name,id);
    Print.printAdd();
    showAllTimer(1000);
}

const makingID = () => {
    return Math.floor(Math.random() * 10000);
}


// delete
const todoDelete = (input) => {
    let id = Number(input[0]);
    let target = todoList.filter(v => v["id"] === id);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);
    todoList.splice(targetIdx,1);

    const Print = new showPrint(targetName);
    Print.printDelete();
    showAllTimer(1000);
}

// update
const todoUpdate = (input) => {
    let [id, status] = input;
    id = Number(id);

    let target = todoList.filter(v => v["id"] === id);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);
    todoList[targetIdx].status = status;

    const Print = new showPrint(targetName, status);
    setTimeout(()=>{Print.printUpdate()}, 1000);
    showAllTimer(4000);
} 


//todoMain = (answer) => {
todoMain = (answer) => {
    // error - 1) $ 체크 answer (1) a-, u- : $x2 / s-, d : $x1 ;
    // if( typeof answer.match(/ /) !== 'object' ) {
    //     todoMainObj.printError("올바른 명령어를 입력해주세요");
    // }

    let tempArr = answer.match(/\w+/g);
    let action = tempArr.shift(0);    

    if(action === "add") {
        todoAdd(tempArr);
    } else if(action === "delete") {
    // error - 2) ID(tempArr[1]) !== todolist[i].ID x  
        todoDelete(tempArr);
    } else if(action === "update") {
    // error - 2) ID(tempArr[1]) !== todolist[i].ID x  
    // error - 3) status(tempArr[2]) === todolist[i].status x 
        todoUpdate(tempArr);
    } else if(action === "show") {
        todoShow(tempArr);
    } else {
    // error -4) msg print
        todoMainObj.printError("올바른 명령어를 입력해주세요");
    }

    console.log(todoList);

    const reOrder = () => {
        r.prompt()    
     }
    action === 'update' ? setTimeout(reOrder, 5000) : setTimeout(reOrder, 2000);
}

//todoMain(arr)


 r.setPrompt('명령하세요 : ');
 r.prompt();
 r.on('line', (line) => {
    
     if(line === 'exit') {
         r.close();
     }

     todoMain(line);
 })

 r.on('close', () => {
     process.exit();
 })