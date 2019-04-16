const todos = require('./data');

class Todo {
	constructor(todos) {
		this.customTodos = todos.reduce(
			(acc, cur) => {
				acc[cur.status].push(cur.name);
				return acc;
			},
			{ todo: [], doing: [], done: [] }
		);
	}

	show(status) {
		if (status === 'all') {
			this.printAll();
		} else {
			this.printStatus(status);
		}
	}

	printAll() {
		console.log(
			Object.entries(this.customTodos).reduce((acc, cur) => {
				return (acc += `${cur[0]}: ${cur[1].length}개 `);
			}, '현재상태 : ')
		);
	}

	printStatus(status) {
		console.log(
			`${status}리스트 총 ${this.customTodos[status].length}건 : ${this.customTodos[status]}`
		);
	}
}

//  const checkTags = (tag) => {
//     let result = [];
//     result = todos.filter((todo) => {
//         return todo.tags.includes(tag);
//     }).map((obj) => { return obj.name });

//     console.log(`${tag} 키워드 검색 결과 :`  + result.join(', '));
//  }

const todo = new Todo(todos);
todo.show('all');
todo.show('done');
todo.show('doing');
todo.show('todo');
// show('status', 'all');
//  show("status", "todo");
//  show("status", "doing");
//  show("status", "done");
//  show("tag", "favorite");
//  show("tag", "food");
//  show("tag", "javascript");
