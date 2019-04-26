const originData = require('./todosdata.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;

const Utils = require('./utils.js');
const CustomException = require('./customException.js');

function Instruction() {
	this.utils = new Utils();
    this.customException = new CustomException();
}

Instruction.prototype = {

    everyStatus (convertedData) {
		let [numOfTodos, numOfDoings, numOfDones] = [0,0,0];		
		convertedData.forEach((value) => {
			if (value.status === 'todo') numOfTodos++;
			else if (value.status === 'doing') numOfDoings++;
			else if (value.status === 'done') numOfDones++;				
		});
		console.log(`현재상태 : todo: ${numOfTodos}개, doing: ${numOfDoings}개, done: ${numOfDones}개`);
	},
	
	singleStatus (convertedData, status) {
		const tasks = this.utils.getArrByCondition(convertedData, (val) => { return (status === val.status);});
		let message = `${status}리스트 총 ${tasks.length}건 : `;
		tasks.forEach( obj => {
			 message += `'${obj.name}, ${obj.id}번,' `;
		});
		console.log(message);
	},

    show (status) {
		const statusArr = ['all', 'todo', 'doing', 'done'];
		if (status === 'all') {
			this.everyStatus(convertedData);
		} else if (statusArr.includes(status)) {
			this.singleStatus(convertedData, status);
		}
	},
    
    add (name, tags) {
	    const id = this.utils.getRadomId(this.maxIdNum, this.minIdNum);
		let obj = {
			name, 
			tags, 
			status: 'todo', 
			id,
		};
		convertedData.push(obj);
		const message = `${obj.name} 1개가 추가됐습니다.(id : ${obj.id})`;
		console.log(message);
	},
	
    delete (id) {
		const targetObj = this.utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];
		try {
			if (!targetObj) this.customException.notExistIdException();
		} catch (e) {
			console.error(e.message);
			return;
		}
		convertedData.splice(convertedData.indexOf(targetObj), 1);
		let message = `${targetObj.name}이 ${targetObj.status}에서 삭제되었습니다.`;
		console.log(message);
	},
	
    update (id, status) {
		const targetObj = this.utils.getArrByCondition(convertedData, (val) => { return id == val.id;})[0];	
		try {
			if (!targetObj) this.customException.notExistIdException();
			if (targetObj.status === status) this.customException.sameStatusException();
		} catch (e) {
			console.error(e.message);
			return;
		}
		targetObj.status = status;
		const message = `${targetObj.name}가 ${targetObj.status}로 상태가 변경되었습니다`;
		setTimeout(() => {
        	console.log(message);
	    }, 3000); 
	}
};

module.exports = Instruction;