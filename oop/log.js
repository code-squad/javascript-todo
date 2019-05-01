module.exports = Log = function(undoLimit = 3, defaultIndex = -1) {
	(this.queue = []), (this.index = defaultIndex), (this.undoLimit = undoLimit);
};

Log.prototype.getIndex = function() {
	return this.index;
};

Log.prototype.getLength = function() {
	return this.queue.length;
};

Log.prototype.addLog = function(logDataObject) {
	if (this.queue.length > this.undoLimit + 1) {
		this.queue.shift();
	}

	while (this.queue.length > this.index + 1) {
		this.queue.pop();
	}

	this.queue[++this.index] = {
		action: logDataObject.action,
		prevData: logDataObject.prevData,
		nextData: logDataObject.nextData,
		todoListIndex: logDataObject.todoListIndex
	};
};

Log.prototype.undo = function() {
	const action = this.queue[this.index].action;
	const prevData = this.queue[this.index].prevData;
	const nextData = this.queue[this.index].nextData;
	const todoListIndex = this.queue[this.index].todoListIndex;
	console.log(
		`"${nextData.id}"번 항목 '${nextData.name}'이(가) ${nextData.status} 에서 ${prevData.status}로 변경되었습니다.`
	);
	this.index--;
	if (action === 'add') {
		return {
			todoListIndex,
			deleteCount: 1
		};
	} else if (action === 'delete') {
		return {
			todoListIndex,
			deleteCount: 0,
			data: prevData
		};
	} else if (action === 'update') {
		return {
			todoListIndex,
			deleteCount: 1,
			data: prevData
		};
	}
};

Log.prototype.redo = function() {
	this.index++;
	const action = this.queue[this.index].action;
	const prevData = this.queue[this.index].prevData;
	const nextData = this.queue[this.index].nextData;
	const todoListIndex = this.queue[this.index].todoListIndex;

	console.log(
		`"${nextData.id}"번 항목 '${nextData.name}'이(가) ${prevData.status} 에서 ${nextData.status}로 변경되었습니다.`
	);
	if (action === 'add') {
		return {
			todoListIndex,
			deleteCount: 0,
			data: nextData
		};
	} else if (action === 'delete') {
		return {
			todoListIndex,
			deleteCount: 1
		};
	} else if (action === 'update') {
		return {
			todoListIndex,
			deleteCount: 1,
			data: nextData
		};
	}
};
