const todoList = module.require('./data.js');
const errorMessage = module.require('./errorMessage.js');
module.require('date-utils');

module.exports = class todo {
	constructor(rl) {
		this.readline = rl;
	}
	show(element) {
		const regExp = /^all$|^todo$|^doing$|^done$/;
		const matchRegExp = element.match(regExp);
		if (matchRegExp === null) {
			throw new Error(errorMessage.COMMAND_ERROR);
		} else if (matchRegExp[0] === 'all') {
			this.printAll();
		} else {
			this.printList(matchRegExp[0]);
		}
	}

	getStatusList() {
		const listOfStatus = todoList.reduce((acc, cur) => {
			if (acc[cur.status] === undefined) {
				acc[cur.status] = [cur.name];
			} else {
				acc[cur.status].push(cur.name);
			}
			return acc;
		}, {});
		return listOfStatus;
	}
	printAll() {
		const listOfStatus = this.getStatusList();
		let printResult = [];
		for (let status in listOfStatus) {
			printResult.push(`${status} : ${listOfStatus[status].length}개`);
		}
		console.log(`현재상태 : ${printResult.join(', ')}`);
		this.readline.prompt();
	}

	printList(status) {
		const listOfStatus = this.getStatusList();
		const statusList = listOfStatus[status];
		console.log(`${status}리스트 : 총 ${statusList.length} 건 : ${statusList.join(', ')}`);
		this.readline.prompt();
	}

	add(name, tag) {
		const tagResult = tag.replace(/\[|\'|\"|\]/g, '').split(',');
		const id = this.getId();
		const newData = {
			name: name,
			tags: tagResult,
			status: 'todo',
			id: id
		};
		todoList.push(newData);
		console.log(`${newData.name} 1개가 추가되었습니다. (id : ${newData.id})`);
		setTimeout(() => {
			this.printAll();
		}, 1000);
	}

	getId() {
		const id = new Date();
		return Number(id.toFormat('YYMMDDHHMISS'));
	}

	checkValidId(id) {
		// todoList.fi

		let index;
		const targetData = todoList.filter((element, innerIndex) => {
			if (Number(id) === element.id) {
				index = innerIndex;
				return Number(id) === element.id;
			}
		});

		return [targetData[0], index];
	}

	delete(id) {
		const deletingData = this.checkValidId(id);
		if (deletingData[0] === undefined) {
			throw new Error(errorMessage.ID_ERROR);
		}
		const index = this.checkValidId(id)[1];
		const deletingName = deletingData[0].name;
		todoList.splice(index, 1);

		console.log(`${deletingName}가 ${deletingData[0].status}에서 삭제됐습니다.`);
		setTimeout(() => {
			this.printAll();
		}, 1000);
	}

	update(id, status) {
		const targetData = this.checkValidId(id)[0];
		const index = this.checkValidId(id)[1];

		if (targetData === undefined) {
			throw new Error(errorMessage.ID_ERROR);
		}

		if (todoList[index].status === status) {
			throw new Error(errorMessage.STATUS_ERROR);
		}

		todoList[index].status = status;

		setTimeout(() => {
			console.log(`"${targetData.name}"가(이) ${status}로 변경되었습니다.`);
			setTimeout(() => {
				this.printAll();
			}, 1000);
		}, 3000);
	}

	// printError(error) {
	// 	console.log(errorMessage[error]);
	// 	this.readline.prompt();
	// }
};
