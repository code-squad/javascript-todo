/*
 * 할일을 추가할 수 있다.
 * 할일이 추가되면 id 값을 생성하고 결과를 알려준다.
 * 상태는 3가지로 관리된다todo, doing, done.
 * 각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
 * 각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
 * 명령어를 입력시이 '$'를 구분자로 사용해서 넣는다.
 * */

var getReadLine = (function () {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return function () {
        return rl;
    }
})();

var obj = [{ id: 1, task: '고양이 밥주기', state: 'doing'}];