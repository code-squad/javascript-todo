const originData = require('./todosdata.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;
const Utils = require('./utils.js');

function Instruction() {
	
}

Instruction.prototype = {

    show : (status) => {
        const statusArr = ['all', 'todo', 'doing', 'done'];
		
		if (status === 'all') {
			let [numOfTodos, numOfDoings, numOfDones] = [0,0,0];		
			
			convertedData.forEach((value) => {
				
				if (value.status === 'todo') numOfTodos++;
				else if (value.status === 'doing') numOfDoings++;
				else if (value.status === 'done') numOfDones++;				
				
			});
			
            console.log(`현재상태 : todo: ${numOfTodos}개, doing: ${numOfDoings}개, done: ${numOfDones}개`);

		} else if (statusArr.includes(status)) {
			const tasks = Utils.prototype.getArrByCondition(convertedData, (val) => { return (status === val.status);});
			let message = `${status}리스트 총 ${tasks.length}건 : `;
			tasks.forEach( obj => {
				 message += `'${obj.name}, ${obj.id}번,' `;
			});
			
			console.log(message);
		}
    },
    add : () => {},
    delete : () => {},
    update :() => {}
};

module.exports = Instruction;