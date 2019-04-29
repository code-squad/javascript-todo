const schedule_list = require('./data');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// param으로 obj를 받으면 obj에 무엇이 들어있는지 알기 어려운것같은데 해결방안이 있을까요? 
function App(obj) {
    this.errorChecker = obj.errorChecker;
    this.editor = obj.editor;
    this.viewer = obj.viewer;
}



App.prototype = {


    run() {

        rl.question('명령을 입력하세요: ', (input) => {
            if (input === 'q') return rl.close();
            try {
                [key, ...message] = this.parseCommand(input)
                this.errorChecker.$check(message)

                if (key === "show") {
                    [status] = message
                    status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(status);
                    return this.run();
                }

                const result = this.editor[key + 'Todo'](...message);

                Promise.resolve()
                    .then(() => {
                        if (key === 'update') {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    this.viewer[key + 'Message'](...result)
                                    resolve()
                                }, 3000)
                            })
                        }
                        this.viewer[key + 'Message'](...result)
                    })
                    .then(() => {
                        setTimeout(() => {
                            this.viewer.showAll()
                            this.run();
                        }, 1000);
                    })
            }
            catch (e) {
                this.viewer.errorMessage(e);
                this.run();
            }

        });
    },

    parseCommand(input) {
        return input.split('$');
    },
}


function Editor(errorChecker) {
    this.errorChecker = errorChecker;
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
        return [newTodoObject.name, newTodoObject.id];
    },

    updateTodo(_id, _status) {

        const selectedObject = this.findSelectedIdObj(_id);
        this.errorChecker.statusCheck(selectedObject.status,_status);
        selectedObject.status = _status;

        return this.filterNameStatusArrayfromSelectedObject(selectedObject);

    },

    deleteTodo(_id) {

        const selectedObject = this.findSelectedIdObj(_id);
        

        schedule_list.some((todo, index) => {
            if (todo.id === parseInt(_id)) return schedule_list.splice(index, 1)
        })
        return this.filterNameStatusArrayfromSelectedObject(selectedObject);

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

    addMessage(_name, _id) {
        console.log(`${_name}가 추가되었습니다. (id :${_id})`);
    },

    updateMessage(_name, _status) {
        console.log(`${_name}의 상태가 ${_status}로 변경되었습니다.`);
    },

    deleteMessage(_name, _status) {
        console.log(`${_name} ${_status}가 목록에서 삭제 되었습니다.`);
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