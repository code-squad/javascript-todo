var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function Task(content) {
    this.id = this.getNextId();
    this.status = statusConstant.TODO;
    this.content = content;
    this.createdAt = new Date();
    this.startAt;
    this.doneAt;
    this.timeSpent;
}

Task.prototype.getNextId = (function () {
    var id = 0;

    return function () {
        //고유 값을 유지하기 위해 반환후 1증가시켜준다.
        return id++;
    }
})();

Task.prototype.updateStatus = function(change) {
    this.status = change;

    switch (change) {
        case statusConstant.DOING:
            //작업 시작시간 저장
            this.startAt = new Date();
            break;

        case statusConstant.DONE:
            //작업 완료시간 저장
            this.doneAt = new Date();

            //걸린 시간 계산후 저장
            this.timeSpent = (this.startAt) ?
                getTimeDiff(this.startAt, this.doneAt) :
                getTimeDiff(this.createdAt, this.doneAt);
            break;
    }
};

// interpreter
var interpreter = {
    commandList: [ //실행가능한 명령어 목록
        {
            name: 'show',
            validateParams: function(params) {
                /*
                 * - show 명령의 pramater가 유효한지 검사
                 * 1. pramas의 인자 개수가 1개 인가?
                 * 2. 해당 parameter가 'todo', 'doing', 'done' 셋 중 하나인가?
                 */
            }
        },
        {
            name: 'add',
            validateParams: function(params) {
                /*
                 * - add 명령의 parameter가 유효한지 검사
                 * 1. pramas의 인자 개수가 1개 인가? (어느 문자열이든 상관 없다.)
                 */
            }
        },
        {
            name: 'update',
            validateParams: function(params) {
                /*
                 * - update 명령의 parameter가 유효한지 검사
                 * 1. pramas의 인자 개수가 1개 인가? (어느 문자열이든 상관 없다.)
                 */
            }
        }
    ],
    validate: function(commandName, params) {
        /*
         * - 명령어와 해당 명령의 파라미터가 유효한지 검사한다.
         * 1. commandName이 commandList에 존재하는지 검사.
         * 2. 존재한다면 해당 객체의 validateParams 메서드를 호출하여 파라미터가 유효한지 검사.
         */
    },
    execute: function(input) {
        /*
         * - 사용자 입력을 '$'문자열 단위로 잘라서 배열로 만든다.
         * validate함수를 호출하여 사용자의 입력이 유효한지 검사한다.
         * 유효하지 않으면 에러 발생
         * 유효하다면 commandName(string)과 params(배열)를 객체에 담아 반환
         */
    }
}

//app
var app = {
    taskList: [], //task 객체가 저장되는 배열
    showCurrentStatus: function() {
        /*
         * - taskList를 순회하여 todo, doing, done 상태의 task 개수를 각각 출력한다.
         */
    },
    show: function(status) {
        /*
         * - {status}상태에 해당하는 task객체를 모두 보여준다.
         * 1. task.status === {status}인 task객체를 filtering
         * 2. 개수가 0이면 {status} 상태의 task가 없다는 Error 발생
         * 3. status가 'done'이면 filtering한 모든 객체 각각의 "id, 내용, 걸린시간" 출력
         * 4. 'done'이 아니면 filtering한 모든 객체 각각의 "id, 내용" 출력
         */
    },
    add: function(content) {
        /*
         * - {content}내용을 가지는 task객체를 생성하여 taskList에 추가한다.
         * 새로운 task가 추가됐다는 메세지 출력 "id, content"
         */
    },
    update: function(targetId, status) {
        /*
         * - {targetId}와 일치하는 task 객체를 taskList에서 찾아 task.status 값을 {status}로 변경한다.
         * 1. {targetId}에 해당하는 task객체의 index를 찾는다.
         * 2. index를 찾이 못하면 Error 반환
         * 3. 해당 task객체의 status값이 {status}와 같으면 Error 반환
         * 4. 해당 task객체의 updateStatus메서드 호출
         * 5. {status}값이 'done'이면 3초 후 showCurrentStatus메서드 호출 아니면 바로 호출
         */
    }
}

rl.on('line', function(input) {
    try {
        var result = interpreter.execute(input);
        app[result.commandName].apply(app, result.params);
    } catch(exception) {
        console.log(exception);
    }
});
