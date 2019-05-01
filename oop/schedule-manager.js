const schedule_list = require('./data');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class App {
    constructor(obj) {
        const { errorChecker, editor, viewer } = obj
        this.errorChecker = errorChecker;
        this.editor = editor
        this.viewer = viewer;
        this.delayTime = 1000;
        this.updateDelayTime = 3000;
        // this.result; 현재결과를 저장하면 좋긴하겠지만 비구조화 할당불편함
    }

    convertParamObj([key, ...message]) {
        // 리팩토링하고 싶지만 message[0]이건 각 명령이 너무 달라서 못바꾸고
        // 각 key마다 생성되는 객체의 구조는 같아서 생성자함수 만들고, 덮어쓰는 방법으로는 해결할 수 있을듯 
        const keyCommand = {
            add: {
                name: message[0],
                tag: message[1]
            },
            update: {
                id: message[0],
                status: message[1]
            },
            delete: {
                id: message[0]
            }
        }
   
        return keyCommand[key]

    }

    run() {

        rl.question('명령을 입력하세요: ', (input) => {
            if (input === 'q') return rl.close();
            try {
                const [key, ...message] = this.parseCommand(input)
                const paramObj = this.convertParamObj(this.parseCommand(input));
                if (key !== 'redo' && key !== 'undo') this.errorChecker.$check(message)

                if (key === "show") {
                    const [status] = message
                    status === "all" ? this.viewer.showAll() : this.viewer.showFiltered(status);
                    return this.run();
                }

                const currentResult = this.editor[key + 'Todo'](paramObj);


                if (key !== 'undo' && key !== 'redo') {
                    this.editor.redoStack = [];
                    this.editor.undoStack.push({ key, currentResult });
                }
                // console.log(this.editor.undoStack);
                // console.log('---------------------');
                // console.log(this.editor.redoStack);
                // console.log('---------------------');
                // console.log(schedule_list);

                Promise.resolve(this.updateDelayTime)
                    .then(() => {
                        if (key === 'update') {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    this.viewer[key + 'Message'](currentResult)
                                    resolve(this.delayTime)
                                }, this.updateDelayTime)
                            })
                        }
                        this.viewer[key + 'Message'](currentResult)
                        return new Promise((resolve) => resolve(this.delayTime))
                    })
                    .then((time) => this.delayShow(time))
            }
            catch (e) {
                this.viewer.errorMessage(e);
                this.run();
            }

        });
    }

    delayShow(time) {
        setTimeout(() => {
            this.viewer.showAll()
            this.run();
        }, time);
    }

    parseCommand(input) {
        return input.split('$');
    }
}


class Editor {
    constructor(errorChecker) {
        this.errorChecker = errorChecker;
        this.undoStack = [];
        this.redoStack = [];
        this.Note = {
            add : this.deleteTodo,
            update: this.updateTodo,
            delete: this.addTodo
        }


    }


    undoTodo() {
        this.errorChecker.stackNull(this.undoStack.length)
        const lastEdit = this.undoStack.pop();
        this.redoStack.push(lastEdit);

        if (lastEdit.key === 'update'){
            this.updateTodo({
                id: lastEdit.currentResult.id,
                status: lastEdit.currentResult.preStatus
            });
        }

        else{this.Note[lastEdit.key].call(this, lastEdit.currentResult)}
        return lastEdit;

    }

    redoTodo() {
        this.errorChecker.stackNull(this.redoStack.length)

        const lastUndo = this.redoStack.pop();
        this[lastUndo.key + "Todo"](lastUndo.currentResult)
        this.undoStack.push(lastUndo);
        return lastUndo
    }

    addTodo(_obj) {
        const { name, tag, id } = _obj;
        const newId = id || this.getUniqueId()

        // class 안에 생성자 함수 못만드는것같아서 add내부에 싱글턴 생성 
        const newTodoObject = {
            name: name,
            tag: tag,
            status: 'todo',
            id: newId
        };
        schedule_list.push(newTodoObject);
        return { ...newTodoObject };
    }

    updateTodo(_obj) {
        const { id, status } = _obj;

        const selectedObject = this.findSelectedIdObj(id);
        const preStatus = selectedObject.status
        this.errorChecker.statusCheck(selectedObject.status, status);
        // find로 찾은 객체가 원본 배열의 객체를 바꾸어버리는 문제 발견 
        selectedObject.status = status;

        return { ...selectedObject, preStatus };

    }

    deleteTodo(_obj) {
        const { id } = _obj;
        const selectedObject = this.findSelectedIdObj(id);
        const selectedObjectIndex = this.findSelectedIdObjIndex(id);
        schedule_list.splice(selectedObjectIndex, 1);

        return { ...selectedObject };

    }

    getUniqueId() {
        return Date.now()
    }


    findSelectedIdObj(_id) {
        const findedObj = schedule_list.find(todo => todo.id === parseInt(_id));
        if (this.errorChecker.idCheck(findedObj));
        return findedObj;
    }

    findSelectedIdObjIndex(_id) {
        return schedule_list.findIndex(todo => todo.id === parseInt(_id));
    }

}



class Viewer {
    showAll() {
        const statusBox = schedule_list.reduce((accum, curr) => {
            accum[curr.status] = ++accum[curr.status] || 1;
            return accum;
        }, {});


        const showAllResult = Object.entries(statusBox).map(([key, value]) => `${key}는 ${value}개`).join(", ");
        console.log(`현재상태 : ${showAllResult}`);
    }

    showFiltered(_status) {
        const showFilteredResult = schedule_list.filter(todo => todo.status === _status)
            .map(todo => `'${todo.name}, ${todo.id}번'`);
        console.log(`${_status}리스트 : 총${showFilteredResult.length}건 : ${showFilteredResult.join(', ')}`);

    }
    undoMessage(_obj) {
        const { key, currentResult } = _obj
        const { id, name, status, preStatus } = currentResult
        const undoNote = {
            add: `명령취소! id: ${id} ${name}가 ${status}에서 삭제되었습니다.`,
            update: `명령취소! id: ${id} ${name}의 ${status}를 ${preStatus}로 되돌렸습니다.`,
            delete: `명령취소! id: ${id} ${name}가 삭제에서 ${status}로 생성되었습니다.`
        }
        console.log(undoNote[key])

    }
    redoMessage(_obj) {
        const { key, currentResult } = _obj
        const { id, name, status, preStatus } = currentResult
        const redoNote = {
            add: `undo취소! id: ${id} ${name}가 삭제에서 ${status}로 재 생성되었습니다.`,
            update: `undo취소! id: ${id} ${name}의 ${preStatus}를 ${status}로 되돌렸습니다.`,
            delete: `undo취소! id: ${id} ${name}가 ${status}에서 재 삭제되었습니다.`
        }
        console.log(redoNote[key])
    }

    addMessage(_obj) {
        const { name, id } = _obj
        console.log(`${name}가 추가되었습니다. (id :${id})`);
    }

    updateMessage(_obj) {
        const { name, status } = _obj
        console.log(`${name}의 상태가 ${status}로 변경되었습니다.`);
    }

    deleteMessage(_obj) {
        const { name, status } = _obj
        console.log(`${name} ${status}가 목록에서 삭제 되었습니다.`);
    }

    errorMessage(errorObject) {
        console.log(errorObject.message)
    }

}

class ErrorChecker {
    $check(_message) {
        if (_message.length === 0) throw new Error('InputError : $ is not exist ')
    }

    statusCheck(_todo_status, _status) {
        if (_todo_status === _status) throw new Error('StatusError : status is same')
    }

    idCheck(_obj) {
        if (_obj === undefined) throw new Error('IdError : id is not valid')
    }

    stackNull(_length) {
        if (_length === 0) throw new Error('stackError : Stack is empty')
    }
}

const schedule_errorChecker = new ErrorChecker();
const schedule_editor = new Editor(schedule_errorChecker);
const schedule_viewer = new Viewer();

const schedule_manager = new App({
    errorChecker: schedule_errorChecker,
    editor: schedule_editor,
    viewer: schedule_viewer
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