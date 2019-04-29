const datalist = require('./data').todos;
const readline = require('readline');
const inputReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const TodoApp = function (datalist) {
    this.datalist = datalist;
    this.command = undefined;
    this.save = false;
    this.past = [];
    this.present = [];
    this.future = [];
    this.storeCommand = [];
};


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
        this.undoable(command, newTodo);

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
        this.undoable(command, splicedData);
        this.manageMaxLengthOfPastArr();

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
        this.undoable(command, { currentIndex, beforeUpdatedStatus, updatedStatus });
        return this.updateCompleted(currentIndex, updatedStatus)
    },


    updateCompleted(currentIndex, updatedStatus) {
        const updateResult = `${this.datalist[currentIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
        setTimeout(() => {
            this.showAll_printResult(updateResult);
        }, 3000);
    },

    collectShowElements() {
        const todoList = this.checkStatus(this.datalist, 'todo');
        const doingList = this.checkStatus(this.datalist, 'doing');
        const doneList = this.checkStatus(this.datalist, 'done');
        return { todoList, doingList, doneList }
    },


    carryShowElements(status) {
        const todoElementList = this.collectShowElements()
        return this.showTodo(status, todoElementList);
    },

    showTodo(status, todoElementList) {
        const { todoList, doingList, doneList } = todoElementList
        switch (status) {
            case 'all':
                return `현재상태 : todo: ${todoList.length}개, doing: ${doingList.length}개, done: ${doneList.length}개 \n`
            case 'todo':
                return `todo리스트 : 총 ${todoList.length} 건 : ${todoList} \n`
            case 'doing':
                return `doing리스트 : 총 ${doingList.length} 건 : ${doingList} \n`;
            case 'done':
                return `done리스트 : 총 ${doneList.length} 건 : ${doneList} \n`
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

    saveCommandAfterUndo(command) {
        if (this.save) {
            this.storeCommand.push(command);
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

        if (command === 'show') {
            console.log(this.carryShowElements(commandElement));
            inputReadline.prompt();
        }
        else if (command === 'add') {
            this.saveCommandAfterUndo(command);
            this.addExecutor(command, commandElement, TagORStatusOfcommandElement);
        }
        else if (command === 'update') {
            this.saveCommandAfterUndo(command);
            this.updateExecutor(command, Number(commandElement), TagORStatusOfcommandElement);
        }
        else if (command === 'delete') {
            this.saveCommandAfterUndo(command);
            this.deleteExecutor(command, Number(commandElement));
        }
        else if (command === 'undo') {
            this.save = true;
            this.undo();
        }
        else if (command === 'redo') {
            this.redo();
        }
        else {
            this.printError();
        }
    },

    undoable(command, splicedData) {
        this.past.push(splicedData);
        this.command = command;
    },

    manageMaxLengthOfPastArr() {
        if (this.past.length < 4) {
            return
        }
        else {
            this.past.shift();
            this.manageMaxLengthOfPastArr();
        }
    },

    initSaveCommandAfterUndo() {
        if (this.storeCommand.length != 0) {
            this.past = [];
            this.present = [];
            this.future = [];
            this.storeCommand = [];
            this.save = false;
        }
    },

    undo() {

        if (this.past.length === 0) {
            console.log('\n undo할 값이 없습니다!');
            inputReadline.prompt();
            return;
        }

        const popPastValue = this.past.pop();

        if (this.present.length === 1) {
            this.future.push(this.present.pop());
            this.present.push(popPastValue);
        } else {
            this.present.push(popPastValue);
        }

        if (this.command === 'add') {
            this.datalist.pop();
            console.log(`\n ${popPastValue.id}번 항목 ${popPastValue.name}가 식제됐습니다.`);
        }
        else if (this.command === 'update') {
            this.datalist[popPastValue.currentIndex].status = popPastValue.beforeUpdatedStatus;
            console.log(`\n ${datalist[popPastValue.currentIndex].id}번 항목 ${datalist[popPastValue.currentIndex].name}가 ${datalist[popPastValue.currentIndex].status}상태로 변경이 취소되었습니다.`);
        }
        else {
            this.datalist.push(popPastValue);
            console.log(`\n ${popPastValue.id}번 항목 ${popPastValue.name}가 삭제에서 ${popPastValue.status}상태로 변경되었습니다.`);
        }

        this.initSaveCommandAfterUndo();
        inputReadline.prompt();

        return;
    },

    redo() {
        if (this.save || this.present[0] === undefined) {
            console.log('\n redo할 값이 없습니다!');
            inputReadline.prompt();
            return;
        }
        
        this.initSaveCommandAfterUndo();

        const popPresentValue = this.present.pop();

        this.past.push(popPresentValue);
        this.present.push(this.future.pop());

        if (this.command === 'add') {
            this.datalist.push(popPresentValue);
            console.log(`\n ${popPresentValue.name} 1 개가 추가됐습니다.(id : ${popPresentValue.id})`);
        }
        else if (this.command === 'update') {
            this.datalist[popPresentValue.currentIndex].status = popPresentValue.updatedStatus;
            console.log(`\n ${this.datalist[popPresentValue.currentIndex].name} 가 ${this.datalist[popPresentValue.currentIndex].status}로 상태가 변경됬습니다.`);
        }
        else {
            this.datalist.pop();
            console.log(`\n ${popPresentValue.id}번 항목 ${popPresentValue.name}가 ${popPresentValue.status}상태에서 삭제되었습니다.`);
        }

        inputReadline.prompt();
        return;
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
