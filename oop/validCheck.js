const errorMessage = module.require('./errorMessage.js');

module.exports = class ValidCheck {
	constructor(todo, log) {
		(this.todo = todo), (this.log = log);
	}
	parseCommand(input) {
		try {
			const inputArray = input.split('$');
			const action = inputArray.splice(0, 1)[0];
			const condition = inputArray;
			const regExp = /^show$|^add$|^delete$|^update$|^undo$|^redo$/;
			const matchRegExp = action.match(regExp);

			if (matchRegExp === null) {
				throw new Error('COMMAND_ERROR');
			} else {
				this[`${action}Check`](...condition);
			}
		} catch (error) {
			console.log(errorMessage[error.message]);
			this.todo.readline.prompt();
		}
	}

	excuteTodo(action, ...condition) {
		if (action === 'show') {
			this.todo[action](...condition);
			return;
		}
		this.log.addLog(this.todo[action](...condition));
	}

	excuteLog(action) {
		this.todo.undoAndRedo(this.log[action]());
		this.todo.readline.prompt();
	}

	showCheck(element) {
		const regExp = /^all$|^todo$|^doing$|^done$/;
		const command = element.match(regExp);
		if (command === null) {
			throw new Error('COMMAND_ERROR');
		}
		this.excuteTodo('show', command[0]);
	}

	addCheck(name, tag) {
		if (name === undefined || tag === undefined || name === '' || tag === '') {
			throw new Error('COMMAND_ERROR');
		}
		const tagResult = tag.replace(/\[|\'|\"|\]/g, '').split(',');

		this.excuteTodo('add', name, tagResult);
	}

	deleteCheck(id) {
		const validIndex = this.todo.checkValidId(id);

		if (validIndex === false) {
			throw new Error('ID_ERROR');
		}

		this.excuteTodo('delete', validIndex);
	}

	updateCheck(id, status) {
		if (status === undefined) {
			throw new Error('COMMAND_ERROR');
		}

		const validIndex = this.todo.checkValidId(id);
		if (validIndex === false) {
			throw new Error('ID_ERROR');
		}

		const regExp = /^todo$|^doing$|^done$/;
		const matchRegExp = status.match(regExp);

		if (matchRegExp === null) {
			throw new Error('COMMAND_ERROR');
		} else if (this.todo.getStatus(validIndex) === status) {
			throw new Error('STATUS_ERROR');
		}

		this.excuteTodo('update', validIndex, status);
	}

	undoCheck() {
		const index = this.log.getIndex();
		if (index < 0) {
			throw new Error('UNDO_ERROR');
		}

		this.excuteLog('undo');
	}

	redoCheck() {
		const index = this.log.getIndex();
		const length = this.log.getLength();
		if (index >= length - 1) {
			throw new Error('REDO_ERROR');
		}

		this.excuteLog('redo');
	}
};
