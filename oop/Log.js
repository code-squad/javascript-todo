const todoList = module.require('./data.js');
class Log {
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
		if (index < 0) {
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
			`"${prevData.id}번 항목 '${prevData.name}'이(가) ${nextData.status} 에서 ${prevData.status}로 변경되었습니다.`
		);
		index--;
	}

	// redo(){
	//   if index >= length-1
	//   error redo 할수 없습니다

	// 	const action = this.queue[this.index].action;
	// 	const prevData = this.queue[this.index].prevData;
	// 	const nextData = this.queue[this.index].nextData;

	// 	if(action === 'add'){

	// 	}else if(action === 'delete'){

	// 	}else if(action === 'update'){

	// 	}

	//   index++

	//   nextData -> todolist
	//   console.log( id, name, prevData , nextData);

	// }

	alterData(todoListIndex, deleteCount, data) {
		todoList.splice(todoListIndex, deleteCount, data);
	}
}
