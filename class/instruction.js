const originData = require('./todosdata.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;
const Utils = require('./utils.js');
const CustomException = require('./customException.js');

const Instruction = class {
    constructor() {
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
	const tasks = Utils.getArrByCondition(convertedData, (val) => { return (status === val.status);});
	let message = `${status}리스트 총 ${tasks.length}건 : `;
	tasks.forEach( obj => {
	    message += `'${obj.name}, ${obj.id}번,' `;
	});
	console.log(message);
    }

    show(status) {
	if (status === 'all') {
	    this.everyStatus(convertedData);
	} else {
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
		try {
		
		const targetObj = Utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];
	    if (!targetObj) customException.notExistIdException();
		
		convertedData.splice(convertedData.indexOf(targetObj), 1);
		
		if (arguments.length == 1) {
			this.createHistoryObj('delete', obj);
		}
		
		let message = `${targetObj.name}이 ${targetObj.status}에서 삭제되었습니다.`;
		console.log(message);
		
	    } catch (e) {
	        console.error(e.message);
	        return;
	    }
    }

    update(id, status) {		
	const targetObj = Utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];
	try {
	    if (!targetObj) CustomException.notExistIdException();
	    if (targetObj.status === status) CustomException.sameStatusException();
	} catch (e) {
	    console.error(e.message);
	    return;
	}

	let preObj = {};
	if (arguments.length === 2) {
	    preObj = Utils.deepCopy(targetObj);
	}

	targetObj.status = status;
	const nextObj = Utils.deepCopy(targetObj);

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
	
	makeLogObj(commandHistory) {
	    const targetObject = commandHistory.historyArr[this.commandHistory.pointer];
	    return {command : targetObject.cmd, preObj : targetObject.pre, nextObj : targetObject.next, checkSum : true, message : ``};
	}

		
	makeLogObj(commandHistory) {
		const targetObject = commandHistory.historyArr[this.commandHistory.pointer];
		return {command : targetObject.cmd, preObj : targetObject.pre, nextObj : targetObject.next, checkSum : true, message : ``};
	}

    undo() {

		const log = this.makeLogObj(this.commandHistory);

		if (log.command === 'add') {
			this.delete(log.preObj.id, log.checkSum);
			log.message += `${log.preObj.id}번 항목 '${log.preObj.name}'가 ${log.preObj.status} 상태에서 삭제됐습니다`;
			
		} else if (log.command === 'delete') {
			convertedData.push(log.preObj);
			log.message += `${log.preObj.id}번 항목 '${log.preObj.name}'가 삭제에서 ${log.preObj.status} 상태로 변경됐습니다`;
			
		} else if (log.command === 'update') {
			this.update(log.preObj.id, log.preObj.status, log.checkSum);
		}
		
		console.log(log.message);
        if (this.commandHistory.pointer > -1) this.commandHistory.pointer--;
    }	

    redo() {
	if (this.commandHistory.pointer < 2) this.commandHistory.pointer++;

	const log = this.makeLogObj(this.commandHistory);

	if (log.command === 'add') {
	    convertedData.push(log.preObj);
	    message += `${log.preObj.id}번 항목 '${log.preObj.name}'가 ${log.preObj.status}에 추가되었습니다`;

	} else if (log.command === 'delete') {
	    this.delete(log.preObj.id, log.checkSum);
	    message += `${log.preObj.id}번 항목 '${log.preObj.name}'가 ${log.preObj.status} 상태에서 삭제됐습니다`;
	} else if (log.command === 'update') {
	    this.update(log.nextObj.id, log.nextObj.status, log.checkSum);
	}
	console.log(log.message);
    }
};

module.exports = Instruction;