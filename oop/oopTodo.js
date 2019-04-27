const datalist = require('./data').todos;
const readline = require('readline');
const inputReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const TodoUI = function (datalist) {
    this.datalist = datalist;
    this.past = [];
    this.present = [];
    this.future = [];
};


TodoUI.prototype = {

    // addTodo
    addTodoExecutor(todoElement, todoTag) {
        this.addTodoList(todoElement, todoTag);
    },

    addTodoList(todoElement, todoTag) {
        const id = this.createNewID(this.datalist, 10000)

        const newTodo = {
            'name': todoElement,
            'tag': todoTag,
            'status': "todo",
            'id': id
        };
        this.datalist.push(newTodo);

        return this.addTodoResult(newTodo);
    },


    addTodoResult(newAddedObject) {
        const addlistResult = `${newAddedObject.name} 1 개가 추가됐습니다.(id : ${newAddedObject.id})`;
        return this.showAll_printResult(addlistResult);
    },

    // deleteTodo
    deleteTodoExecutor(deleteID) {
        return this.checkID(deleteID) ? this.deleteTodoList(deleteID) : this.printError()
    },

    deleteTodoList(deletedID) {
        const deletedIndex = this.getIndex(deletedID);
        const [splicedData] = this.datalist.splice(deletedIndex, 1);
        this.undoable(splicedData);
        this.manageMaxPastList();

        return this.deleteTodoResult(splicedData)
    },

    deleteTodoResult(splicedData) {
        const deletionResult = `${splicedData.name}가 ${splicedData.status}에서 삭제되었습니다.`
        return this.showAll_printResult(deletionResult);
    },


    // updateTodo
    updateTodoExecutor(id, updatedStatus) {
        return this.checkID(id) ? this.updateTodoStatus(id, updatedStatus) : this.printError()
    },


    updateTodoStatus(id, updatedStatus) {
        const updatatingIndex = this.getIndex(id);
        if (this.checkDuplicatedStatus(updatatingIndex, updatedStatus)) {
            console.log('\n');
            inputReadline.prompt();
            return
        };
        this.datalist[updatatingIndex].status = updatedStatus;
        return this.updateTodoResult(updatatingIndex, updatedStatus)
    },


    updateTodoResult(updatatingIndex, updatedStatus) {
        const updateResult = `${this.datalist[updatatingIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
        return setTimeout(() => {
            this.showAll_printResult(updateResult);
        }, 3000);
    },

    showElementGetter() {
        const todoList = this.checkStatus(this.datalist, 'todo');
        const doingList = this.checkStatus(this.datalist, 'doing');
        const doneList = this.checkStatus(this.datalist, 'done');
        return { todoList, doingList, doneList }
    },


    showTodoList(status) {
        const todoElementList = this.showElementGetter()
        return this.showStatusExecutor(status, todoElementList);
    },

    showStatusExecutor(status, todoElementList) {
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
            console.log((this.showTodoList('all')));
            inputReadline.prompt();
        }, 1000);
    },

    splitInputVal(inputData) {
        const splitOnDollarSymbol = inputData.split("$");
        return splitOnDollarSymbol
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

    checkDuplicatedStatus(updatatingIndex, updatedStatus) {
        if (this.datalist[updatatingIndex].status === updatedStatus) {
            console.log('입력한 상태와 동일한 상태입니다')
            return true;
        }
    },


    checkCommands(userInput) {
        const splitUserInput = this.splitInputVal(userInput);
        if (userInput.split('$').length < 1 || userInput.split('$').length > 3) {
            console.log("입력값을 확인해주세요");
            inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
            inputReadline.prompt();
            return;
        }

        const [command, commandElement, TagORStatusOfcommandElement] = splitUserInput;

        if (command === 'show') {
            console.log(this.showTodoList(commandElement));
            inputReadline.prompt();
        }
        else if (command === 'add') {
            this.addTodoExecutor(commandElement, TagORStatusOfcommandElement);
        }
        else if (command === 'update') {
            this.updateTodoExecutor(Number(commandElement), TagORStatusOfcommandElement);
        }
        else if (command === 'delete') {
            this.deleteTodoExecutor(Number(commandElement));
        }
        else if (command === 'undo') {
            this.undo();
        }
        else if (command === 'redo') {
            this.redo();
        }
        else {
            this.printError();
        }
    },


    undoable(splicedData) {
        this.past.push(splicedData);
    },

    manageMaxPastList() {
        if(this.past.length < 4){
            return
        }
        else {
            this.past.shift();
            this.manageMaxPastList();
        }
    },

    undo() {
        if (this.past.length === 0) {
            console.log('undo할 값이 없습니다!');
            inputReadline.prompt();
            return;
        }

        const popPastValue = this.past.pop();
        this.datalist.push(popPastValue);
        this.present.push(popPastValue);
        console.log(`${popPastValue.id}번 항목 ${popPastValue.name}가 삭제에서 ${popPastValue.status}상태로 변경되었습니다.`);
        inputReadline.prompt();
        return;
    },

    redo() {
        if (this.present.length === 0) {
            console.log('redo할 값이 없습니다!');
            inputReadline.prompt();
            return;
        }
        const popPresentValue = this.present.pop();
        this.datalist.pop();
        this.past.push(popPresentValue);
        console.log(`${popPresentValue.id}번 항목 ${popPresentValue.name}가 ${popPresentValue.status}상태에서 삭제되었습니다.`);
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


const todoList = new TodoUI(datalist);
todoList.mainExecutor();
