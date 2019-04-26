const todoList = module.require('./data.js');
module.exports = class Log {
	constructor() {
		(this.queue = []), (this.index = -1);
	}

	addLog(action, prevData, nextData, todoListIndex) {
		if (this.queue.length > 4) {
			this.queue.shift();
		}

		while (this.queue.length > this.index + 1) {
			this.queue.pop();
		}

		this.queue[++this.index] = {
			action: action,
			prevData: prevData,
			nextData: nextData,
			todoListIndex: todoListIndex
		};
	}

	undo() {
		if (this.index < 0) {
			throw new Error('UNDO_ERROR');
		}

		const action = this.queue[this.index].action;
		const prevData = this.queue[this.index].prevData;
		const nextData = this.queue[this.index].nextData;
		const todoListIndex = this.queue[this.index].todoListIndex;

		if (action === 'add') {
			this.alterData(todoListIndex, 1);
		} else if (action === 'delete') {
			this.alterData(todoListIndex, 0, prevData);
		} else if (action === 'update') {
			this.alterData(todoListIndex, 1, prevData);
		}
		console.log(
			`"${nextData.id}"번 항목 '${nextData.name}'이(가) ${nextData.status} 에서 ${prevData.status}로 변경되었습니다.`
		);
		this.index--;
	}

	redo() {
		if (this.index >= this.queue.length - 1) {
			throw new Error('REDO_ERROR');
		}

		this.index++;
		const action = this.queue[this.index].action;
		const prevData = this.queue[this.index].prevData;
		const nextData = this.queue[this.index].nextData;
		const todoListIndex = this.queue[this.index].todoListIndex;

		if (action === 'add') {
			this.alterData(todoListIndex, 0, nextData);
		} else if (action === 'delete') {
			this.alterData(todoListIndex, 1);
		} else if (action === 'update') {
			this.alterData(todoListIndex, 1, nextData);
		}

		console.log(
			`"${nextData.id}"번 항목 '${nextData.name}'이(가) ${prevData.status} 에서 ${nextData.status}로 변경되었습니다.`
		);
	}

	alterData(todoListIndex, deleteCount, data) {
		todoList.splice(todoListIndex, deleteCount, data);
	}
};
