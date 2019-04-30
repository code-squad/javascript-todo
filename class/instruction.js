const originData = require('./todosdata.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;
const Utils = require('./utils.js');
const CustomException = require('./customException.js');

const Instruction = class {
    constructor() {
        this.utils = new Utils();
	this.minIdNum = 1;
	this.maxIdNum = 99999;

	this.commandHistory = {
		historyArr : [],
		pointer : -1,
	};
    }

    everyStatus (convertedData) {
	let [numOfTodos, numOfDoings, numOfDones] = [0,0,0];		
	convertedData.forEach(({status}) => {
	    if (status === 'todo') numOfTodos++;
	    else if (status === 'doing') numOfDoings++;
	    else if (status === 'done') numOfDones++;				
	});
	
	console.log(`현재상태 : todo: ${numOfTodos}개, doing: ${numOfDoings}개, done: ${numOfDones}개`);
    }

    singleStatus (convertedData, status) {
	const tasks = this.utils.getArrByCondition(convertedData, (val) => { return (status === val.status);});
	let message = `${status}리스트 총 ${tasks.length}건 : `;
	tasks.forEach( obj => {
	    message += `'${obj.name}, ${obj.id}번,' `;
	});
	console.log(message);
    }

    show(status) {
	const statusArr = ['all', 'todo', 'doing', 'done'];
	if (status === 'all') {
	    this.everyStatus(convertedData);
	} else if (statusArr.includes(status)) {
	    this.singleStatus(convertedData, status);
	}
    }

    add(name, tags) {
        const id = this.utils.getRandomId(this.maxIdNum, this.minIdNum);
	let obj = {
		name, 
		tags, 
		status: 'todo', 
		id,
	};
	convertedData.push(obj);
	if (arguments.length !== 3) {
	    this.createHistoryObj('add' ,obj);
	}
	const message = `${obj.name} 1개가 추가됐습니다.(id : ${obj.id})`;
	console.log(message);
    }

    delete(id) {
	const targetObj = this.utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];
	try {
	    if (!targetObj) customException.notExistIdException();
	} catch (e) {
	    console.error(e.message);
	    return;
	}
	
	convertedData.splice(convertedData.indexOf(targetObj), 1);

	if (arguments.length == 1) {
	    this.createHistoryObj('delete', obj);
	}
	let message = `${targetObj.name}이 ${targetObj.status}에서 삭제되었습니다.`;
	console.log(message);
    }

    update(id, status) {		
	const targetObj = this.utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];
	try {
	    if (!targetObj) CustomException.notExistIdException();
	    if (targetObj.status === status) CustomException.sameStatusException();
	} catch (e) {
	    console.error(e.message);
	    return;
	}

	let preObj = {};
	if (arguments.length === 2) {
	    preObj = this.utils.deepCopy(targetObj);
	}

	targetObj.status = status;
	const nextObj = this.utils.deepCopy(targetObj);

	if (arguments.length === 2) {
	    this.createHistoryObj('update', preObj, nextObj);
	}
	const message = `${targetObj.name}가 ${targetObj.status}로 상태가 변경되었습니다`;
	
	setTimeout(() => {
	console.log(message);
        }, 3000); 
    }

    pushObj(arr, obj) {
	if (arr.length === 3) {
	    arr.shift();
	    arr.push(obj);
	} else if (arr.length < 3) {
	    arr.push(obj);	
	}
    }

    createHistoryObj(command, ...obj) {	
	let historyObj = {};
	if (command === 'update') { 
	    historyObj = {
		command,
		pre: obj[0],
		next: obj[1]
	    };
	} else if (command === 'add' || command === 'delete') {  
	    historyObj = {
		command,
		pre: obj[0]
	    };
	}
	this.pushObj(this.commandHistory.historyArr, historyObj);
	this.commandHistory.pointer++;
    }

    undo() {
	const targetObject = this.commandHistory.historyArr[this.commandHistory.pointer];
	const [command, preObj, checkSum] = [targetObject.command, targetObject.pre, true];

	let message = ``;

	if (command === 'add') {
	    this.delete(preObj.id, checkSum);
	    message += `${preObj.id}번 항목 '${preObj.name}'가 ${preObj.status} 상태에서 삭제됐습니다`;

	} else if (command === 'delete') {
	    convertedData.push(preObj);
	    message += `${preObj.id}번 항목 '${preObj.name}'가 삭제에서 ${preObj.status} 상태로 변경됐습니다`;

	} else if (command === 'update') {
	    this.update(preObj.id, preObj.status, checkSum);
	}

	console.log(message);

	if (this.commandHistory.pointer > -1) this.commandHistory.pointer--;
    }	

    redo() {
	if (this.commandHistory.pointer < 2) this.commandHistory.pointer++;

	const targetObject = this.commandHistory.historyArr[this.commandHistory.pointer];		
	const [command, preObj, nextObj, checkSum] = [targetObject.command, targetObject.pre, targetObject.next, true];

	let message = ``;

	if (command === 'add') {
	    convertedData.push(preObj);
	    message += `${preObj.id}번 항목 '${preObj.name}'가 ${preObj.status}에 추가되었습니다`;

	} else if (command === 'delete') {
	    this.delete(preObj.id, checkSum);
	    message += `${preObj.id}번 항목 '${preObj.name}'가 ${preObj.status} 상태에서 삭제됐습니다`;
	} else if (command === 'update') {
	    this.update(nextObj.id, nextObj.status, checkSum);
	}
	console.log(message);
    }
};

module.exports = Instruction;