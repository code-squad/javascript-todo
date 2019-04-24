const schedule_list = require('./data');
// 데이터베이스에서 스케쥴배열을 가져온다.


const {log} = console;



function App(){
    this.editor = new Editor();
    this.viewer = new Viewer();
}


App.prototype.run = function(input){
    // 콘솔에서 입력받아서 parseCommand 함수를 실행하도록 한다.
    // 파즈커맨드에서 반환받은 값을 받탕으로 컨트롤러를 실행한다.
    [key, ...message] =  this.parseCommand(input)
    if(key === "show") {
        [status] = message
        return status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(status);
    }
    this.editor[key+'Todo'](...message);
    this.viewer.showAll()
    // exit을 입력받을때까지 끊임없이 동작하도록 한다.
}

// show$all
// show$todo
// add$name$tag
// update$id$status
// delete$id

App.prototype.parseCommand = function(input){
    // run 에서 입력값을 받아서 입력값이 첫번쨰 커맨드를 key로 받고, 나머지를 key에 들어갈 인자로 분류한다.
    // key에 맞는 명령을 컨트롤러에서 실행하도록 하고, 이떄 분류한 나머지를 컨트롤러의 함수의 인자로 들어가도록한다. 
    return input.split('$');
     
}




function Editor(){
}


//show$all
//show$todo
Editor.prototype.TodoObject = function(name,tag){
    // return {
    //     id : 1,
    //     // id : this.getUniqueId(),
    //     name: name,
    //     tag: tag,
    //     status: 'todo'
    // }
    this.name = name
    this.tag = tag
    this.status = 'todo'
    this.id = 1

}

// add$name$tag명
Editor.prototype.addTodo = function(name,tag){
    // run에서 넘어온 입력값을 name, tag로 받아서 새로운 newtodoObject를 생성한다.
    const newTodoObject = new this.TodoObject(name,tag);
    schedule_list.push(newTodoObject);
 
    // const newTodoObject = new Editor.prototype.todoObject(name,tag); 
    // database에서 가져온 데이터 배열에 push한다. 
    log('addTodo is run')
}

//update$id$status
Editor.prototype.updateTodo = function(id,status){
    // 넘어온 id에 맞는 schedule배열의 인자객체를 찾는다.
    //  그 인자객체의 status를 변경한다. 
    log('updateTodo is run')
}

Editor.prototype.deleteTodo = function(id){
    // 넘어온 id에 맞는 schedule 배열의 인자객체를 찾는다.
    // 그 인자객체를 삭제한다. 
    log('deleteTodo is run')

}

Editor.prototype.getUniqueId = function(){
    // 유니크한  숫자를 만들고 반환한다. 
}

function Viewer(){
}


//show$all
Viewer.prototype.showAll = function(){
    // schdule_list에서 상태(todo,doing,done)에 맞게 값을 가지고 있는 객체,또는 배열을 만든다.
    // 객체또는 배열의 인자를  한줄로 출력한다. 
    const statusBox = schedule_list.reduce((accum,curr)=>{
        accum[curr.status] = ++accum[curr.status] || 1;
        return accum;
   },{});
   

   const showAllResult = Object.entries(statusBox).map(el=>{
       const [key,value] = el
       return `${key}는 ${value}개`;
   }).join(", ");

   console.log(`현재상태 : ${showAllResult}`);
}

// show$status
Viewer.prototype.showFiltered = function(status){
    // run에서 넘겨받은 status를  scheduled_list에서 가지고 있는 객체를 찾아 배열로 만든다.

    const showFilteredResult = schedule_list.filter(todo => todo.status === status)
    .map(todo => `'${todo.name}, ${todo.id}번'`);

    // 배열의 인자들을 한줄로 출력한다. 
    console.log(`${status}리스트 : 총${showFilteredResult.length}건 : ${showFilteredResult.join(', ')}`);

}

const schedule_manager = new App();

schedule_manager.run('show$all');
schedule_manager.run('show$todo');
schedule_manager.run('add$운동하기$exercise');