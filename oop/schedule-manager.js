const schedule_list = require('./data');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function App() {
    this.editor = new Editor();
    this.viewer = new Viewer();
    this.errorChecker = new ErrorChecker();
}



App.prototype = {

    run() {

        rl.question('명령을 입력하세요: ', async (input) => {
            if (input === 'q') return rl.close();
            try {
                [key, ...message] = this.parseCommand(input)

                this.errorChecker.$check(message)

                this[key](...message);
            }
            catch (e) {
                console.log(e.message);
                this.run();
            }

        });
    },

    parseCommand(input) {
        return input.split('$');
    },

    show(_status) {
        _status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(_status);
        return this.run();

    },
    add(_name, _tag) {
        const [returnedName, returnedId] = this.editor.addTodo(_name, _tag);

        this.viewer.addMessage(returnedName, returnedId)
        this.delayShow(1000);
    },
    update(_id, _status) {
        const [returnedName, returnedStatus] = this.editor.updateTodo(_id, _status);
        setTimeout(() => {
            this.viewer.updateMessage(returnedName, returnedStatus)
            this.delayShow(1000);
        }, 3000)

    },
    delete(_id) {
        const [returnedName, returnedStatus] = this.editor.deleteTodo(_id);

        this.viewer.deleteMessage(returnedName, returnedStatus)
        this.delayShow(1000);
    },
    delayShow(time) {
        setTimeout(() => {
            this.viewer.showAll();
            this.run();
        }, time);
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
        return [newTodoObject.name, newTodoObject.id];
    },

    updateTodo(_id, _status) {

        const selectedObject = schedule_list.find(todo => todo.id === parseInt(_id));


        return schedule_list.some(todo => {
            if (todo.id === parseInt(_id)) {
                this.errorChecker.statusCheck(todo.status, _status)
                return todo.status = _status
            }
        }) ? Object.entries(selectedObject).filter(([key, value]) =>
        key === 'name' || key === 'status'
    ).map(([key, value]) => value) : this.errorChecker.foundIdError();


    },

    deleteTodo(_id) {

        const selectedObject = schedule_list.find(todo => todo.id === parseInt(_id));
        const selectedArray = Object.entries(selectedObject).filter(([key, value]) =>
        key === 'name' || key === 'status'
        ).map(([key, value]) => value);
        return schedule_list.some((todo, index) => {
            if (todo.id === parseInt(_id)) return schedule_list.splice(index, 1)
        }) ? selectedArray : this.errorChecker.foundIdError();
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
    addMessage(_name, _id) {
        console.log(`${_name}가 추가되었습니다. (id :${_id})`);
    },
    updateMessage(_name, _status) {
        console.log(`${_name}의 상태가 ${_status}로 변경되었습니다.`);
    },
    deleteMessage(_name, _status) {
        console.log(`${_name} ${_status}가 목록에서 삭제 되었습니다.`);
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

    foundIdError() {
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