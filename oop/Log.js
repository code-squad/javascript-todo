class Log {
	constructor() {
		(this.queue = []), (this.index = -1);
	}

	addLog(action, prevData, nextData) {
		if (this.queue.length > 4) {
			this.queue.shift();
		}

		while (this.queue.length > this.index + 1) {
			this.queue.pop();
		}

		this.queue[++this.index] = {
			action: action,
			prevData: prevData,
			nextData: nextData
		};
	}

	// undo(){
	//   if( index < 0)
	//   error 되돌릴수 없습니다

	//   index -> queue{
	//     action
	//     prevData
	//     nextData
	//   }

	//   prevData -> todolist

	//   //delete일때
	//   console.log( id, name, nextstatus, prevstatus)

	//   index --;

	// }

	// redo(){
	//   if index >= length-1
	//   error redo 할수 없습니다

	//   index++

	//   nextData -> todolist
	//   console.log( id, name, prevData , nextData);

	// }
}
