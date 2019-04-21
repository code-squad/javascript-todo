const processData = require('./process_data');
const print = require('./print_message');

// 비동기로 처리..show all..
const showCompletionStatus = (milliSecond) => {
    setTimeout( () => { controlCommand('show', ['all']); }, milliSecond );
}

const checkparamArr = (command, paramArr) => { 
    switch(command) {
        case 'show': case 'delete': return paramArr.length === 1;
        case 'add':  case 'update': return paramArr.length === 2;
    }
}

const checkCommand = (currentCommand) => {
    return ['show', 'add', 'delete', 'update'].some( (command) => { return currentCommand === command } );
}

const checkStatus = (currentStatus) => {
    return ['all', 'todo', 'doing', 'done'].some( (status) => { return currentStatus === status } );
}

const checkIdForm = (id) => { return isNaN(id) ? false : true; }

const checkTagForm = (tag) => { return tag.match(/(?<=\[\")[a-z]*(?=\"\])/i) !== null; }

const showTodoList = (paramArr) => {
    const viewType   = paramArr[0];
    const statusList = processData.getStatusListByTodoList();
    print.completeShowMessage(viewType, statusList);
    return true;
}

const addTodo = (paramArr) => {
    const randomId = processData.getRandomID();
    if (randomId === undefined) return print.errorMessage('Id Full');
    const inputName = paramArr[0];
    const inputTag  = paramArr[1].split('["').join('').split('"]').join('');
    const inputData = {'name': inputName, 'tags': [inputTag], 'status': 'todo', 'id': randomId};
    processData.saveTodoList(inputData, 'add');
    print.completeAddMessage(inputName, randomId);
    showCompletionStatus(1000);
    return true;
}

const deleteTodo = (paramArr) => {
    const inputId = parseInt(paramArr[0]);
    const findId = processData.getTodoId(inputId);
    if (findId === undefined) {
        return print.errorMessage('Not Exist Id');
    } else {
        const [index, name, status] = processData.getNameAndStatusById(findId);
        processData.saveTodoList(index, 'delete');
        print.completeDeleteMessage(name, status);
        showCompletionStatus(1000);
        return true;
    }
}

const updateTodo = (paramArr) => {
    const inputId = parseInt(paramArr[0]);
    const status = paramArr[1];
    const findId = processData.getTodoId(inputId);
    if (findId === undefined) {
        return print.errorMessage('Not Exist Id');
    } else {
        const [index, name] = processData.getNameAndStatusById(findId);
        processData.saveTodoList([index, status], 'update');
        setTimeout( () => { 
            print.completeUpdateMessage(name, status);
            showCompletionStatus(1000); 
        } , 3000 );
        return true;
    }
}

const controlCommand = (command, paramArr) => {
    if (!checkCommand(command))             return print.errorMessage('command');
    if (!checkparamArr(command, paramArr))  return print.errorMessage('paramArr'); 

    switch(command) {
        case 'show': 
        {
            if (!checkStatus(paramArr[0])) return print.errorMessage('status'); 
            return showTodoList(paramArr);
        }
        case 'add': 
        {
            if(!checkTagForm(paramArr[1])) return print.errorMessage('tag'); 
            return addTodo(paramArr); 
        }
        case 'delete': 
        {
            if (!checkIdForm(paramArr[0])) return print.errorMessage('id'); 
            return deleteTodo(paramArr); 
        }
        case 'update': 
        {
            if (!checkIdForm(paramArr[0])) return print.errorMessage('id'); 
            if (!checkStatus(paramArr[1])) return print.errorMessage('status');
            return updateTodo(paramArr); 
        }
    }
}

module.exports = controlCommand;
