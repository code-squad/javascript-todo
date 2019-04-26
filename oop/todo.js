require('date-utils');
const Log = module.require('./Log.js');
const todoLog = new Log();

const commonDelaySecond = 1000;
const updateDelaySecond = 3000;

module.exports = class todo {
	constructor(todoList, rl) {
		this.readline = rl;
		this.todoList = todoList;
	}
	show(element) {
		const regExp = /^all$|^todo$|^doing$|^done$/;
		const matchRegExp = element.match(regExp);
		if (matchRegExp === null) {
			throw new Error('COMMAND_ERROR');
		} else if (matchRegExp[0] === 'all') {
			this.printAll();
		} else {
			this.printList(matchRegExp[0]);
		}
	}

	getStatusList() {
		const listOfStatus = this.todoList.reduce((acc, cur) => {
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
		if (name === undefined || tag === undefined || name === '' || tag === '') {
			throw new Error('COMMAND_ERROR');
		}
		const tagResult = tag.replace(/\[|\'|\"|\]/g, '').split(',');
		const id = this.getId();
		const newData = {
			name: name,
			tags: tagResult,
			status: 'todo',
			id: id
		};
		this.todoList.push(newData);
		const prevData = {};
		Object.assign(prevData, newData);
		prevData.status = '삭제';
		console.log(`${newData.name} 1개가 추가되었습니다. (id : ${newData.id})`);
		todoLog.addLog('add', prevData, newData, this.todoList.length - 1);
		setTimeout(() => {
			this.printAll();
		}, commonDelaySecond);
	}

	getId() {
		const id = new Date();
		return Number(id.toFormat('YYMMDDHHMISS'));
	}

	checkValidId(id) {
		let index;
		const targetData = this.todoList.filter((element, innerIndex) => {
			if (Number(id) === element.id) {
				index = innerIndex;
				return Number(id) === element.id;
			}
		});
		if (targetData[0] === undefined) {
			throw new Error('ID_ERROR');
		}

		return index;
	}

	delete(id) {
		const index = this.checkValidId(id);
		const deletingName = this.todoList[index].name;

		console.log(`${deletingName}가 ${this.todoList[index].status}에서 삭제됐습니다.`);
		const nextData = {};
		Object.assign(nextData, this.todoList[index]);
		nextData.status = '삭제';
		todoLog.addLog('delete', this.todoList[index], nextData, index);
		this.todoList.splice(index, 1);
		setTimeout(() => {
			this.printAll();
		}, commonDelaySecond);
	}

	update(id, status) {
		const index = this.checkValidId(id);
		const regExp = /^todo$|^doing$|^done$/;
		const matchRegExp = status.match(regExp);

		if (matchRegExp === null) {
			throw new Error('COMMAND_ERROR');
		} else if (this.todoList[index].status === status) {
			throw new Error('STATUS_ERROR');
		}
		const prevData = {};
		Object.assign(prevData, this.todoList[index]);
		this.todoList[index].status = status;
		todoLog.addLog('update', prevData, this.todoList[index], index);

		setTimeout(() => {
			console.log(`"${this.todoList[index].name}"가(이) ${status}로 변경되었습니다.`);
			setTimeout(() => {
				this.printAll();
			}, commonDelaySecond);
		}, updateDelaySecond);
	}

	undo() {
		todoLog.undo();
		this.readline.prompt();
	}
	redo() {
		todoLog.redo();
		this.readline.prompt();
	}
};
