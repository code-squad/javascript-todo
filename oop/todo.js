const todoList = module.require('./data.js');
module.require('date-utils');

module.exports = class todo {
	constructor(rl) {
		this.readline = rl;
	}
	// show
	//매개변수 all, status(todo,done,doing)
	// 매개변수에 해당하는 데이터 출력
	show(element) {
		const regExp = /^all$|^todo$|^doing$|^done$/;
		const matchRegExp = element.match(regExp)[0];
		console.log(matchRegExp);
		if (matchRegExp === 'all') {
			return this.printAll();
		}
		this.printList(matchRegExp);
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
		console.log(listOfStatus);
		this.readline.prompt();
	}

	printList(status) {
		const listOfStatus = this.getStatusList();
		const statusList = listOfStatus[`${status}`];
		let outputString = `${status}리스트 : 총 ${statusList.length} 건 : `;
		for (let i in statusList) {
			outputString += statusList[i];
			if (i < statusList.length - 1) {
				outputString += ', ';
			}
		}
		console.log(outputString);
		this.readline.prompt();
	}
	//  add
	add(name, tag) {
		console.log(name, tag);
		const id = this.getId();
		const newData = {
			name: name,
			tags: tag,
			status: 'todo',
			id: id
		};
		todoList.push(newData);
		setTimeout(() => {
			this.printAll();
		}, 1000);
	}
	// 		add$name$["tag1"]
	// 		tag !==tag
	// 		console err

	getId() {
		const id = new Date();
		return id.toFormat('YYMMDDHHMISS');
	}

	// 	// delete
	// 	// 매개변수 id
	// 	// id에 해당하는 데이터 삭제
	// 	// showall 1초뒤에 실행
	// 	// 존재하지 않는 id경우 출력

	delete(id) {
		let index;
		const deletingData = todoList.filter((element, innerIndex) => {
			if (Number(id) === element.id) {
				index = innerIndex;
				return Number(id) === element.id;
			}
		})[0];
		// if(id === undefined){
		// 	err
		// 	console.log(존재하지 않음)
		// 	rl.prompt()
		// }
		const deletingName = deletingData.name;
		todoList.splice(index, 1);

		console.log(`${deletingName}가 ${deletingData.status}에서 삭제됐습니다.`);
		setTimeout(() => {
			this.printAll();
		}, 1000);
	}

	// findIndex(id){
	// 	const  = todoList.filter((element) =>{

	// 	});

	// 	if(data.id === id){
	// 		return indexOfData;
	// 	}
	// }

	// 	// update
	// 	// 매개변수 id, status
	// 	// id에 해당하는 데이터를 status로 상태 변경
	// 	// 3초 뒤에 name 이 status 로 변경되었ㅅ 출력
	// 	// 1초뒤 show all
	// 	// 존재하지 않는 id경우, 같은상태로 update경우 안내 출력

	// 	update([id, status], rl){
	// 		index = findIndex(id)
	// 		if(id === undefined){
	// 			err
	// 			console.log(존재하지 않음)
	// 			rl.prompt()
	// 		}
	// 		data.index.status = status;

	// 		settimeout(3000);
	// 		console.log(name, status)
	// 		settimeout(1000)
	// 		showall()
	// 	}

	// 	printError(element){
	// 		console element;
	// 	}
	// 	//모듈로 꺼내기
};
