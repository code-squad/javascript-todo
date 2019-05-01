const schedule_list = require('./data');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// param으로 obj를 받으면 obj에 무엇이 들어있는지 알기 어려운것같은데 해결방안이 있을까요? 
function App(obj) {
    const {errorChecker,editor,viewer} = obj
    this.errorChecker = errorChecker;
    this.editor = editor
    this.viewer = viewer;
    this.delayTime = 1000;
    this.updateDelayTime = 3000;
    this.result;
}



App.prototype = {


    run() {

        rl.question('명령을 입력하세요: ', (input) => {
            if (input === 'q') return rl.close();
            try {
                const [key, ...message] = this.parseCommand(input)
                if(key !== 'redo' && key!== 'undo') this.errorChecker.$check(message)

                if (key === "show") {
                    const [status] = message
                    status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(status);
                    return this.run();
                }

                this.result = this.editor[key + 'Todo'](...message)
                // console.log(this.result);
                ;
                
                if(key !== 'undo' && key !=='redo'){
                    this.editor.redoStack =[];
                    this.editor.undoStack.push({key,message,result:this.result});
                }
                // console.log(this.editor.undoStack);
                // console.log('---------------------');                
                // console.log(this.editor.redoStack);                
                
                Promise.resolve(this.updateDelayTime)
                    .then(() => {
                        if (key === 'update') {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    this.viewer[key + 'Message'](this.result)
                                    resolve(this.delayTime)
                                }, this.updateDelayTime)
                            })
                        }
                        this.viewer[key + 'Message'](this.result)
                        return new Promise((resolve)=>resolve(this.delayTime))
                    })
                    .then((time)=>this.delayShow(time))
            }
            catch (e) {
                this.viewer.errorMessage(e);
                this.run();
            }

        });
    },

    delayShow(time){
        setTimeout(() => {
            this.viewer.showAll()
            this.run();
        }, time);
    },

    parseCommand(input) {
        return input.split('$');
    },
}


function Editor(errorChecker) {
    this.errorChecker = errorChecker;
    this.undoStack = [];
    this.redoStack = [];
}

Editor.prototype = {
    TodoObject: function (_name, _tag, _newId) {
        this.name = _name
        this.tag = _tag
        this.status = 'todo'
        this.id = _newId
    },
    undoTodo(){
        this.errorChecker.stackNull(this.undoStack.length)

        const lastEdit = this.undoStack.pop();
        this.redoStack.push(lastEdit);

        if(lastEdit.key === 'add'){
            this.deleteTodo(lastEdit.result.id);
        }
        if(lastEdit.key === 'delete'){
            this.addTodo(lastEdit.result.name, lastEdit.result.tag, lastEdit.result.id);
        }
        if(lastEdit.key === 'update'){
            this.updateTodo(lastEdit.result.id, lastEdit.result.preStatus);
        }

        
        return lastEdit;

    },
    redoTodo(){
        this.errorChecker.stackNull(this.redoStack.length)

        const lastUndo = this.redoStack.pop();

        if(lastUndo.key === 'add'){
             this.addTodo(lastUndo.result.name, lastUndo.result.tag, lastUndo.result.id);
        }
        if(lastUndo.key === 'delete'){
             this.deleteTodo(lastUndo.result.id);
        }
        if(lastUndo.key === 'update'){
             this.updateTodo(lastUndo.result.id, lastUndo.result.status);
        }
        this.undoStack.push(lastUndo);
        return lastUndo
    },

    addTodo(_name, _tag, _id) {
        const _newId = _id || this.getUniqueId()
        const newTodoObject = new this.TodoObject(_name, _tag, _newId);
        schedule_list.push(newTodoObject);
        return { ...newTodoObject};
    },

    updateTodo(_id, _status) {

        const selectedObject = this.findSelectedIdObj(_id);
        const preStatus = selectedObject.status 
        this.errorChecker.statusCheck(selectedObject.status,_status);
        // find로 찾은 객체가 원본 배열의 객체를 바꾸어버리는 문제 발견 
        selectedObject.status = _status;

        return {...selectedObject,preStatus};

    },

    deleteTodo(_id) {

        const selectedObject = this.findSelectedIdObj(_id);
        const selectedObjectIndex = this.findSelectedIdObjIndex(_id);

        schedule_list.splice(selectedObjectIndex,1);

        return {...selectedObject};

    },

    getUniqueId() {
        return Date.now()
    },

    filterNameStatusArrayfromSelectedObject(_obj) {
        const filteredArray = Object.entries(_obj).filter(([key, value]) => {
            const seletedStatus = ['name', 'status'];
            return seletedStatus.includes(key)
        })
            .map(([key, value]) => value);
        return filteredArray;
    },

    findSelectedIdObj(_id) {
        const findedObj = schedule_list.find(todo => todo.id === parseInt(_id));
        if (this.errorChecker.idCheck(findedObj));
        return findedObj;
    },

    findSelectedIdObjIndex(_id){
        return schedule_list.findIndex(todo => todo.id === parseInt(_id));
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
    undoMessage(_obj){
        const {key , result} = _obj
        const {id,name,status,preStatus} = result
        const undoNote = {
            add:`명령취소! id: ${id} ${name}가 ${status}에서 삭제되었습니다.`,
            update:`명령취소! id: ${id} ${name}의 ${status}를 ${preStatus}로 되돌렸습니다.`,
            delete:`명령취소! id: ${id} ${name}가 삭제에서 ${status}로 생성되었습니다.`
        }
        console.log(undoNote[key])
        
    },
    redoMessage(_obj){
        const {key , result} = _obj
        const {id,name,status,preStatus} = result
        const redoNote = {
            add:`undo취소! id: ${id} ${name}가 삭제에서 ${status}로 재 생성되었습니다.`,
            update:`undo취소! id: ${id} ${name}의 ${preStatus}를 ${status}로 되돌렸습니다.`,
            delete:`undo취소! id: ${id} ${name}가 ${status}에서 재 삭제되었습니다.`
        }
        console.log(redoNote[key])
    },

    addMessage(_obj) {
        const {name, id} = _obj
        console.log(`${name}가 추가되었습니다. (id :${id})`);
    },

    updateMessage(_obj) {
        const {name, status} = _obj
        console.log(`${name}의 상태가 ${status}로 변경되었습니다.`);
    },

    deleteMessage(_obj) {
        const {name, status} = _obj
        console.log(`${name} ${status}가 목록에서 삭제 되었습니다.`);
    },
    
    errorMessage(errorObject){
        console.log(errorObject.message)
    }
}

function ErrorChecker() { }

ErrorChecker.prototype = {
    $check(_message) {
        if (_message.length === 0) throw new Error('InputError : $ is not exist ')
    },

    statusCheck(_todo_status, _status) {
        if (_todo_status === _status) throw new Error('StatusError : status is same')
    },

    idCheck(_obj) {
        if (_obj === undefined) throw new Error('IdError : id is not valid')
    },

    stackNull(_length){
        if(_length === 0) throw new Error('stackError : Stack is empty')
    }


}

const schedule_errorChecker = new ErrorChecker();
const schedule_editor = new Editor(schedule_errorChecker);
const schedule_viewer = new Viewer();

const schedule_manager =  new App({
    errorChecker : schedule_errorChecker,
    editor : schedule_editor,
    viewer : schedule_viewer
})

schedule_manager.run()
// schedule_manager.run('show$todo');
// schedule_manager.run('add$운동하기$exercise');
// schedule_manager.run('update$9$doing');
// schedule_manager.run('delete$6');
// show$todo
// add$운동하기$exercise
// update$7$doing
// delete$7