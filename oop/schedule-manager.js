const schedule_list = require('./data');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function App() {
    this.origin = this
    this.editor = new Editor(this.origin);
    this.viewer = new Viewer(this.origin);
    this.errorChecker = new ErrorChecker();
}

// show$todo
// add$운동하기$exercise
// update$7$doing
// delete$7
schedule_list

App.prototype = {

     run() {
        const self = this

        function delayShow(){
            return new Promise(function(resolve, reject){
                setTimeout(() => {
                    self.viewer.showAll();
                    self.run();
                }, 1000);

            })
        }

        rl.question('명령을 입력하세요: ', async (input) => {
            if (input === 'q') return rl.close();
            try{
                [key, ...message] = self.parseCommand(input)
                this.errorChecker.$check(message)
                
                if (key === "show") {
                    [status] = message
                    status === "all" ? self.viewer.showAll() : self.viewer.showFiltered(status);
                    return self.run();
                }
               
                
                const selectedObject = self.editor[key + 'Todo'](...message);
                
                await self.viewer[key + 'Message'](selectedObject)
                await delayShow();    
            }
            catch(e){
                console.log(e.message);
                self.run();
            }
            
        });
    },

    parseCommand(input) {
        return input.split('$');
    }
}


function Editor() {
    this.errorChecker = new ErrorChecker();
 }

Editor.prototype = {
    TodoObject: function (_name, _tag, _newId) {
        this.name = _name
        this.tag = _tag
        this.status = 'todo'
        this.id = _newId
    },

    addTodo(_name, _tag) {
        const _newId = this.getUniqueId()
        const newTodoObject = new this.TodoObject(_name, _tag, _newId);
        schedule_list.push(newTodoObject);
        return newTodoObject
    },

    updateTodo(_id, _status) {
        // if(!(ERROR.validId)) return this.app.run()
        
        return schedule_list.some(todo => {
            if (todo.id === parseInt(_id)){
                this.errorChecker.statusCheck(todo.status,_status)
                return todo.status = _status  
            } 
        }) ? schedule_list.find(todo => todo.id === parseInt(_id)) : this.errorChecker.foundIdError();
        

    },

    deleteTodo(_id) {

        const returnedObj = schedule_list.find(todo => todo.id === parseInt(_id));

        return schedule_list.some((todo, index) => {
            if (todo.id === parseInt(_id)) return schedule_list.splice(index, 1)
        }) ? returnedObj : this.errorChecker.foundIdError();
    },

    getUniqueId() {
        return Date.now()
    }
}



function Viewer() { }

Viewer.prototype = {
    showAll() {
        const statusBox = schedule_list.reduce((accum, curr) => {
            accum[curr.status] = ++accum[curr.status] || 1;
            return accum;
        }, {});


        const showAllResult = Object.entries(statusBox).map(([key, value]) => `${key}는 ${value}개`).join(", ");
        console.log(`현재상태 : ${showAllResult}`);
    },

    showFiltered(_status) {
        const showFilteredResult = schedule_list.filter(todo => todo.status === _status)
            .map(todo => `'${todo.name}, ${todo.id}번'`);
        console.log(`${_status}리스트 : 총${showFilteredResult.length}건 : ${showFilteredResult.join(', ')}`);

    },
    addMessage(_obj) {
        console.log(`${_obj.name}가 추가되었습니다. (id :${_obj.id})`);
    },
    updateMessage(_obj) {
        return new Promise(function(resolve, reject){
            setTimeout(() => {
                console.log(`${_obj.name}의 상태가 ${_obj.status}로 변경되었습니다.`);
                resolve();
            }, 3000)
        })
    },
    deleteMessage(_obj) {
        console.log(`${_obj.name} ${_obj.status}가 목록에서 삭제 되었습니다.`);
    }
}

function ErrorChecker(){}

ErrorChecker.prototype = {
    $check(_message){
        if(_message.length === 0) throw new Error('InputError : $ is not exist ')
    },

    statusCheck(_todo_status , _status){
        if(_todo_status === _status) throw new Error('StatusError : status is same')
    },

    foundIdError(){
        throw new Error('IdError : id is not exist')
    }


}


const schedule_manager = new App();
schedule_manager.run()
// schedule_manager.run('show$todo');
// schedule_manager.run('add$운동하기$exercise');
// schedule_manager.run('update$9$doing');
// schedule_manager.run('delete$7');
// show$todo
// add$운동하기$exercise
// update$7$doing
// delete$7