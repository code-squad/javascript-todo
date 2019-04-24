// 데이터베이스에서 스케쥴배열을 가져온다.
const schedule_list = require('./data');

function App(){
    this.controller = new Controller();
    this.view = new View();
}

App.prototype.run = function(input){
    // 콘솔에서 입력받아서 parseCommand 함수를 실행하도록 한다.
    // 파즈커맨드에서 반환받은 값을 받탕으로 컨트롤러를 실행한다.
    [key, ...message] =  this.parseCommand(input)
    this.controller[key+'Todo'](...message);
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




function Controller(){
}

// Controller.prototype.todoObject(name,tag) = {
//     id : this.getUniqueId(),
//     name: name,
//     tag: tag,
//     status: todo
// }

//show$all
//show$todo
Controller.prototype.showTodo = function (status){

    status === "all" ? View.prototype.showAll() : View.prototype.showFiltered(status); 
    

    // 인자를 분류하여 Show 객체의 showAll 또는 showFilter를 실행시켜준다.
    // showFilter에는 status를 인자로 넘겨준다.
}

// add$name$tag명
Controller.prototype.addTodo = function(name,tag){
    // parseCommand로 넘어온 입력값을 name, tag로 받아서 새로운 newtodoObject를 생성한다.
    const newTodoObject = new Controller.prototype.todoObject(name,tag); 
    // database에서 가져온 데이터 배열에 push한다. 
}

//update$id$status
Controller.prototype.updateTodo = function(id,status){
    // 넘어온 id에 맞는 schedule배열의 인자객체를 찾는다.
    //  그 인자객체의 status를 변경한다. 
}

Controller.prototype.deleteTodo = function(id){
    // 넘어온 id에 맞는 schedule 배열의 인자객체를 찾는다.
    // 그 인자객체를 삭제한다. 
}

Controller.prototype.getUniqueId = function(){
    // 유니크한  숫자를 만들고 반환한다. 
}

function View(){

}

View.prototype.showAll = function(){
    // schdule_list에서 상태(todo,doing,done)에 맞게 값을 가지고 있는 객체,또는 배열을 만든다.
    // 객체또는 배열의 인자를  한줄로 출력한다. 
    
}

// show$status
View.prototype.showFiltered = function(status){
    // showTodo에서 넘겨받은 status를  scheduled_list에서 가지고 있는 객체를 찾아 배열로 만든다.
    // 배열의 인자들을 한줄로 출력한다. 
    console.log('showFIlter is run')

}

const schedule_manager = new App();

schedule_manager.run('show$all');
schedule_manager.run('show$todo');