require('date-utils');

const commonDelaySecond = 1000;
const updateDelaySecond = 3000;

module.exports = Todo = function(todoList, readline) {
	this.todoList = todoList;
	this.readline = readline;
};

Todo.prototype.show = function(command) {
	if (command === 'all') {
		this.printAll();
	} else {
		this.printList(command);
	}
};

Todo.prototype.getStatusList = function() {
	const listOfStatus = this.todoList.reduce((acc, cur) => {
		if (acc[cur.status] === undefined) {
			acc[cur.status] = [cur.name];
		} else {
			acc[cur.status].push(cur.name);
		}
		return acc;
	}, {});
	return listOfStatus;
};

Todo.prototype.printAll = function() {
	const listOfStatus = this.getStatusList();
	let printResult = [];
	for (let status in listOfStatus) {
		printResult.push(`${status} : ${listOfStatus[status].length}개`);
	}
	console.log(`현재상태 : ${printResult.join(', ')}`);
	this.readline.prompt();
};

Todo.prototype.printList = function(status) {
	const listOfStatus = this.getStatusList();
	const statusList = listOfStatus[status];
	console.log(`${status}리스트 : 총 ${statusList.length} 건 : ${statusList.join(', ')}`);
	this.readline.prompt();
};

Todo.prototype.add = function(name, tag) {
	const id = this.getId();
	const newData = {
		name: name,
		tag,
		status: 'todo',
		id: id
	};
	this.todoList.push(newData);
	const prevData = Object.assign({}, newData);
	prevData.status = '삭제';
	console.log(`${newData.name} 1개가 추가되었습니다. (id : ${newData.id})`);

	setTimeout(() => {
		this.printAll();
	}, commonDelaySecond);
	return { action: 'add', prevData, nextData: newData, todoListIndex: this.todoList.length - 1 };
};

Todo.prototype.getId = function() {
	const id = new Date();
	return Number(id.toFormat('YYMMDDHH24MISS'));
};

Todo.prototype.checkValidId = function(id) {
	let index;
	const targetData = this.todoList.filter((element, innerIndex) => {
		if (Number(id) === element.id) {
			index = innerIndex;
			return Number(id) === element.id;
		}
	});

	if (targetData[0] === undefined) {
		return false;
	}
	return index;
};

Todo.prototype.getStatus = function(index) {
	return this.todoList[index].status;
};

Todo.prototype.delete = function(index) {
	const deletingName = this.todoList[index].name;

	console.log(`${deletingName}가 ${this.todoList[index].status}에서 삭제됐습니다.`);
	const nextData = Object.assign({}, this.todoList[index]);
	nextData.status = '삭제';
	this.todoList.splice(index, 1);
	setTimeout(() => {
		this.printAll();
	}, commonDelaySecond);
	return { action: 'delete', prevData: this.todoList[index], nextData, todoListIndex: index };
};

Todo.prototype.update = function(index, status) {
	const prevData = Object.assign({}, this.todoList[index]);
	this.todoList[index].status = status;

	setTimeout(() => {
		console.log(`"${this.todoList[index].name}"가(이) ${status}로 변경되었습니다.`);
		setTimeout(() => {
			this.printAll();
		}, commonDelaySecond);
	}, updateDelaySecond);
	return { action: 'update', prevData, nextData: this.todoList[index], todoListIndex: index };
};

Todo.prototype.undoAndRedo = function(obj) {
	if (obj.data == undefined) {
		this.todoList.splice(obj.todoListIndex, obj.deleteCount);
	} else {
		this.todoList.splice(obj.todoListIndex, obj.deleteCount, obj.data);
	}
};
