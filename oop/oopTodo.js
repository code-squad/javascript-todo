const datalist = require('./data').todos;
const readline = require('readline');
const UndoableApp = require('./undoable');
const inputReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const TodoApp = function (datalist) {
    this.datalist = datalist;
};

const undoableApp = new UndoableApp(datalist, inputReadline);


TodoApp.prototype = {

    // addTodo
    addExecutor(command, todoElement, todoTag) {
        this.addTodo(command, todoElement, todoTag);
    },

    addTodo(command, todoElement, todoTag) {
        const id = this.createNewID(this.datalist, 10000)

        const newTodo = {
            'name': todoElement,
            'tag': todoTag,
            'status': "todo",
            'id': id
        };
        this.datalist.push(newTodo);
        undoableApp.undoable(command, newTodo);
        undoableApp.manageMaxLengthOfPastArr(4);

        return this.addCompleted(newTodo);
    },


    addCompleted(newAddedObject) {
        const addResult = `${newAddedObject.name} 1 개가 추가됐습니다.(id : ${newAddedObject.id})`;
        this.showAll_printResult(addResult);
    },

    // deleteTodo
    deleteExecutor(command, deleteID) {
        return this.checkID(deleteID) ? this.deleteTodo(command, deleteID) : this.printError()
    },

    deleteTodo(command, deletedID) {
        const currentIndex = this.getIndex(deletedID);
        const [splicedData] = this.datalist.splice(currentIndex, 1);
        undoableApp.undoable(command, splicedData);
        undoableApp.manageMaxLengthOfPastArr(4);

        return this.deleteCompleted(splicedData)
    },

    deleteCompleted(splicedData) {
        const delResult = `${splicedData.name}가 ${splicedData.status}에서 삭제되었습니다.`
        this.showAll_printResult(delResult);
    },


    // updateTodo
    updateExecutor(command, id, updatedStatus) {
        return this.checkID(id) ? this.updateTodo(command, id, updatedStatus) : this.printError()
    },


    updateTodo(command, id, updatedStatus) {
        const currentIndex = this.getIndex(id);
        if (this.checkDuplicatedStatus(currentIndex, updatedStatus)) {
            console.log('\n');
            inputReadline.prompt();
            return;
        };
        const beforeUpdatedStatus = this.datalist[currentIndex].status
        this.datalist[currentIndex].status = updatedStatus;
        undoableApp.undoable(command, { currentIndex, beforeUpdatedStatus, updatedStatus });
        undoableApp.manageMaxLengthOfPastArr(4);
    
        return this.updateCompleted(currentIndex, updatedStatus)
    },


    updateCompleted(currentIndex, updatedStatus) {
        const updateResult = `${this.datalist[currentIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
        setTimeout(() => {
            this.showAll_printResult(updateResult);
        }, 3000);
    },

    collectShowElements() {
        const showElements = ['todo', 'doing', 'done'];
        const assignShowElements = {'todo': undefined, 'doing' : undefined, 'done' : undefined};
        for(let i = 0; i < showElements.length; i++) {
            assignShowElements[showElements[i]] = this.checkStatus(this.datalist, showElements[i]);
        }
        return assignShowElements
    },


    carryShowElements(status) {
        const todoElementList = this.collectShowElements()
        return this.showTodo(status, todoElementList);
    },

    showTodo(status, todoElementList) {
        const { todo, doing, done } = todoElementList
        switch (status) {
            case 'all':
                return `현재상태 : todo: ${todo.length}개, doing: ${doing.length}개, done: ${done.length}개 \n`
            case 'todo':
                return `todo리스트 : 총 ${todo.length} 건 : ${todo} \n`
            case 'doing':
                return `doing리스트 : 총 ${doing.length} 건 : ${doing} \n`;
            case 'done':
                return `done리스트 : 총 ${done.length} 건 : ${done} \n`
            default:
                return '명령어를 올바로 입력해주세요. \n';
        }
    },


    showAll_printResult(result) {
        console.log(result);
        setTimeout(() => {
            console.log((this.carryShowElements('all')));
            inputReadline.prompt();
        }, 1000);
    },

    splitInput(inputData) {
        const splitOnDollarSymbol = inputData.split("$");
        return splitOnDollarSymbol;
    },

    printError() {
        console.error('입력하신 값이 존재하지않습니다. \n');
        inputReadline.prompt();
        return;
    },


    getIndex(inputId) {
        return this.datalist.map((element) => { return element["id"] }).indexOf(inputId);
    },


    checkStatus(objData, status) {
        return objData.filter(list => list.status === status).map(list => { return list.name });
    },


    createNewID(datalist, maxNumOfID) {
        const newID = Math.floor(Math.random() * maxNumOfID) + 1;
        const checkDuplicatedID = this.checkID(newID);
        if (typeof checkDuplicatedID !== 'undefined') createNewID(datalist, maxNumOfID);

        return newID;
    },


    checkID(inputID) {
        const [matchedListByID] = this.datalist.filter(list => {
            return list.id == inputID
        })
        return matchedListByID;
    },


    checkDuplicatedStatus(currentIndex, updatedStatus) {
        if (this.datalist[currentIndex].status === updatedStatus) {
            console.log('입력한 상태와 동일한 상태입니다')
            return true;
        }
    },

    
    checkCommands(userInput) {
        const splitUserInput = this.splitInput(userInput);
        if (userInput.split('$').length < 1 || userInput.split('$').length > 3) {
            console.log("입력값을 확인해주세요");
            inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
            inputReadline.prompt();
            return;
        }

        const [command, commandElement, TagORStatusOfcommandElement] = splitUserInput;
        switch(command) {
            case 'show':
                console.log(this.carryShowElements(commandElement));
                inputReadline.prompt();
                break;
            case 'add':
                undoableApp.saveCommandAfterUndo(command);
                this.addExecutor(command, commandElement, TagORStatusOfcommandElement);
                break;
            case 'update':
                undoableApp.saveCommandAfterUndo(command);
                this.updateExecutor(command, Number(commandElement), TagORStatusOfcommandElement);
                break;
            case 'delete':
                undoableApp.saveCommandAfterUndo(command);
                this.deleteExecutor(command, Number(commandElement));
                break;
            case 'undo':
            undoableApp.save = true;
                undoableApp.undo();
                break;
            case 'redo':
                undoableApp.redo();
                break;
            default:
                this.printError();
       }
    },

    mainExecutor() {
        inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
        inputReadline.prompt();
        inputReadline.on('line', function (line) {

            if (line === "q") inputReadline.close();
            todoList.checkCommands(line);
        })

            .on('close', function () {
                console.log('프로그램이 종료되었습니다.');
                process.exit();
            });
    }

}


const todoList = new TodoApp(datalist);
todoList.mainExecutor();
