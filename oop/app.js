const data = module.require('./data.js');
const todo = module.require('./todo.js');
// 입력받는 함수
// 프롬프트 사용
// 데이터 파싱
// $ 없는경우 에러처리
// 파싱 불가능한 경우 에러처리
// 명령호출을 호출
const inputCommand = () => {
	const readline = require('readline');

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.setPrompt('명령하세요 : ');

	rl.prompt();
	rl.on('line', input => {
		const inputArray = input.split('$');
		if (inputArray.length === 1) {
			console.log('명령어가 올바르지 않습니다.');
			rl.prompt();
		}
		const action = inputArray.splice(0, 1)[0];
		const condition = inputArray;

		excuteTodo(action, condition, rl);
	});
};
// 명령어 호출해주는 함수
// 입력받은 명령을 호출

const excuteTodo = (action, condition, readline) => {
	const regExp = /^show$|^add$|^delete$|^update$/;
	const matchRegExp = action.match(regExp);
	if (matchRegExp === null) {
		console.log('명령어가 올바르지 않습니다.');
		return readline.prompt();
	}
	todo[action](condition, readline);
};

inputCommand();
