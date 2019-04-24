const schedule_list = require('./data');
// 데이터베이스에서 스케쥴배열을 가져온다.


const {log} = console;



function App(){
    this.editor = new Editor();
    this.viewer = new Viewer();
    
}

// 'show$todo'
// 'add$운동하기$exercise'
// 'update$7$doing'
// 'delete$7'

App.prototype.run = function(input){
    // 콘솔에서 입력받아서 parseCommand 함수를 실행하도록 한다.
    // 파즈커맨드에서 반환받은 값을 받탕으로 컨트롤러를 실행한다.
    [key, ...message] =  this.parseCommand(input)
    if(key === "show") {
        [status] = message
        return status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(status);
    }
    this.editor[key+'Todo'](...message);
    this.viewer[key+'Message'](...message);
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
Editor.prototype.TodoObject = function(name,tag, newId){
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
    this.id = newId

}

// add$name$tag명
Editor.prototype.addTodo = function(name,tag){
    // run에서 넘어온 입력값을 name, tag로 받아서 새로운 newtodoObject를 생성한다.
    // database에서 가져온 데이터 배열에 push한다. 

    const newId = this.getUniqueId()
    const newTodoObject = new this.TodoObject(name,tag,newId);
    schedule_list.push(newTodoObject);
    
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
    return Date.now() 
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
   

   const showAllResult = Object.entries(statusBox).map(([key,value]) => `${key}는 ${value}개`).join(", ");
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
Viewer.prototype.addMessage = function(name,tag){
    // 인자로 넘어온 name에 맞는 id를 찾으면 됨. 
    // console.log(`${name}이 추가되었습니다. (id :${id}`);
    log('add메세지출력')
}
Viewer.prototype.updateMessage = function(id,status){
    // 인자로 넘어온 id의 이름만 찾으면 됨
    // console.log(`${name}의 상태가 ${status}로 변경되었습니다.`);
    log('update메세지출력')
}
Viewer.prototype.deleteMessage = function(id){
    // 인자로 넘어온 id에 맞는 name, status를 찾으면 됨
    // console.log(`${name} ${status}가 목록에서 삭제 되었습니다.`);
    log('delete메세지출력')
}

const schedule_manager = new App();

schedule_manager.run('show$all');
schedule_manager.run('show$todo');
schedule_manager.run('add$운동하기$exercise');
schedule_manager.run('update$7$doing');
schedule_manager.run('delete$7');