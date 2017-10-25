const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const obj = [{ id: 1, task: "테스트1", state: "doing" }];

function Task(task) {
    this.id = '';
    this.task = task;
    this.state = 'todo';
    this.start = new Date();
    this.end = null;
}

var util = {
    printMsg: function () {
        var result = []
        for (var i = 0; i < arguments.length; i++) {
            result += arguments[i];
        }
        console.log(result);
    },
    //object를 string 으로 변환하여 출력
    //obj = [ { id: 1, task: "자바스크립트 공부", state: "doing" } -> id:1 task:자바스크립트 공부 state:doing
    objTostr: function (target) {
        var result = "";
        for (property in target) {
            if (target[property].constructor === 'object') util.objTostr(target[property]);
            else result += property + ":" + target[property] + " ";
        }
        return result;
    }
}

var todo = {

    //add 명령어 함수. 배열의 마지막 객체의 id값을 1증가하여 id생성. 매개변수를 task명으로 넣고 현재상태출력
    add: function (task) {
        var id = 1;
        id += obj[obj.length - 1]['id'];
        obj[obj.length] = { "id": id, "task": task, "state": "todo", "start": null };
        util.printMsg("id : ", id, "  \"", task, "\" 항목이 새로 추가됬습니다. ");
        this.getState();
    },

    //배열을 순회하며 state count 를 출력
    getState: function () {
        var flag = { todo: 0, doing: 0, done: 0 };
        for (property in obj) {
            flag[obj[property]['state']]++;
        }
        util.printMsg("현재상태 : ", util.objTostr(flag));
    },

    //showing 전용함수 . 출력형태를 객체전체에서 id,task로 수정 -> "1, 그래픽스 공부" , "4, 블로그쓰기" .. 
    showing: function (key, value) {
        var result = [];
        if (value === "done") {
            for (property in obj) {
                var task = obj[property]['task'];
                var time = parseInt((Date.now() - obj[property]['start']) / 1000);
                if (obj[property][key] === value)
                    result += "\'" + task + ", " + time + "초\' ";
            }
        }
        else {
            for (property in obj) {
                var id = obj[property]['id'];
                var task = obj[property]['task'];
                if (obj[property][key] === value)
                    result += "\'" + id + ", " + task + "\' ";
            }
        }
        util.printMsg(result);
        start();
    },

    //obj[property][id] == index 로 값을 찾아서 state 수정
    //매개변수가 '부족'할때만 에러메세지 update$index$state -> 3개
    //id:index 검색 -> state:value로 수정 ex)setState(1,"done") -> id가 1인 객체의 state를 "done"으로 수정
    setState: function (index, value) {
        if (value === "done") {
            for (property in obj) {
                if (obj[property]['id'] === index) {
                    obj[property]['state'] = value;
                    obj[property]['end'] = Date.now();
                }
            }
        }
        else {
            for (property in obj) {
                if (obj[property]['id'] === index) {
                    obj[property]['state'] = value;
                }
            }
        }
        this.getState();
        start();
    },
    //state가 done인 상태의 객체를 찾아서 소요시간이 더 짧은 객체만 result에 남겨서 출력
    getMinTask: function () {
        var runtime = Date.now();
        var result;
        for (property in obj) {
            if (obj[property]['state'] === "done" && obj[property]['end'] - obj[property]['start'] < runtime) {
                runtime = obj[property]['end'] - obj[property]['start'];
                result = obj[property];
            }
        }
        util.printMsg(result);
    }

}
start();

//시작지점 종료입력이 나오기전까지 작동
function start() {
    rl.question("\ncmd: add showing update exit\n>", function (answer) {
        var allcmd = ["add", "showing", "update", "exit"];
        var cmd = answer.split("$")[0]; //answer = add$test -> answer.split("$")[0] = add
        var check = Number(allcmd.indexOf(cmd)); //allcmd.indexOf(cmd)); //-1일경우 없는 명령어

        if (check === -1) {
            util.printMsg("wrong input!");
            start();
        }
        else {
            if (check === 0) { // check = 0
                todo.add(answer.split("$")[1]);
                start();
            }
            else if (cmd === "showing") { // check == 1
                todo.showing("state", answer.split("$")[1]);
                start();
            }
            else if (cmd === "update") { // check == 2
                todo.setState(Number(answer.split("$")[1]), answer.split("$")[2]);
                start();
            }
            else if (cmd === "exit") {
                util.printMsg("Do your Best!");
                rl.close();
            }
            else rl.close();
        }
    });
}
//start();