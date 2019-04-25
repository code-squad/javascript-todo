const todoList = module.require('./data.js');
module.exports = class todo {
	// show
	//매개변수 all, status(todo,done,doing)
	// 매개변수에 해당하는 데이터 출력
	show([element], readline) {
		const regExp = /^all$|^todo$|^doing$|^done$/;
		const matchRegExp = element.match(regExp)[0];
		if (matchRegExp === 'all') {
			return this.printAll();
		}
		// printlist(matchRegExp);
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
		console.log('showAll');
		const listOfStatus = getStatusList();
		console.log(listOfStatus);
	}

	// printList(status){
	// 	const listOfStatus = getStatusList();

	// 	console.log(status)
	// }
	// 	// add
	// 	// 매개변수 name,tag
	// 	// id생성
	// 	// name과 id tag 로 만들어진 데이터 추가
	// 	// showall 1초뒤에 실행
	// 	add([name, tag],rl){
	// 		add$name$["tag1"]
	// 		tag !==tag
	// 		console err

	// 		id = getid();
	// 		data.push({
	// 			name
	// 			id
	// 			tag
	// 		}

	// 		console.log(name, id, tag)

	// 		settimeout(){
	// 			printall();
	// 		1000}

	// 	}

	// 	getid(){
	// 		return Math.random();
	// 	}

	// 	// delete
	// 	// 매개변수 id
	// 	// id에 해당하는 데이터 삭제
	// 	// showall 1초뒤에 실행
	// 	// 존재하지 않는 id경우 출력

	// 	delete([id],rl){
	// 		index = findIndex(id)
	// 		if(id === undefined){
	// 			err
	// 			console.log(존재하지 않음)
	// 			rl.prompt()
	// 		}
	// 		name = data.splice(index)

	// 		console.log(name, id)

	// 		settimeout(){
	// 			printall();
	// 		1000}
	// 	}

	// 	findIndex(id){
	// 		if(data.id === id){
	// 			return indexOfData;
	// 		}
	// 	}

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
