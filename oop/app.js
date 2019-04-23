const data = module.require('./data.js');

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
			rl.prompt();
		}

		excute(inputArray);

		rl.prompt();
	});
};
// excute();
// 입력받는 함수
// 프롬프트 사용
// 데이터 파싱
// $ 없는경우 에러처리
// 파싱 불가능한 경우 에러처리
// 명령호출을 호출

// 명령어 호출해주는 함수
// 입력받은 명령을 호출
