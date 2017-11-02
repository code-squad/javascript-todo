const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const obj = [];

function Task(id, task) {
    this.id = id;
    this.task = task;
    this.state = 'todo';
    this.start = null;
    this.end = null;
    this.runtime = null;
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

    //시작지점 종료입력이 나오기전까지 작동
    run: function () {
        rl.question("\ncmd: add showing update exit\n>", function (answer) {
            var allcmd = ["add", "showing", "update", "mintask", "exit"];
            var cmd = answer.split("$")[0]; //answer = add$test -> answer.split("$")[0] = add
            var check = Number(allcmd.indexOf(cmd)); //allcmd.indexOf(cmd)); //-1일경우 없는 명령어

            if (check === -1) {
                util.printMsg("wrong input!");
                todo.run();
            }
            else {
                if (check === 0) { // check = 0
                    todo.add(answer.split("$")[1]);
                    todo.run();
                }
                else if (cmd === "showing") { // check == 1
                    todo.showing("state", answer.split("$")[1]);
                    todo.run();
                }
                else if (cmd === "update") { // check == 2
                    todo.setState(Number(answer.split("$")[1]), answer.split("$")[2]);
                    todo.run();
                }
                else if (cmd === "mintask") {
                    todo.getMinTask();
                    todo.run();
                }
                else if (cmd === "exit") {
                    util.printMsg("Do your Best!");
                    rl.close();
                }
                else rl.close();
            }
        });
    },
    state: {
        MinTime: Infinity,
        MinTask: null,
        stateCount: { todo: 0, doing: 0, done: 0 }
    },
    //add 명령어 함수. 배열의 length를 id로 기록.  매개변수를 task명으로 넣고 현재상태출력
    add: function (task) {
        var id = obj.length + 1;
        this.state.stateCount.todo++;
        obj[obj.length] = new Task(id, task);
        util.printMsg("id : ", id, "  \"", task, "\" 항목이 새로 추가됬습니다. ");
        this.getState();
    },

    //state객체의 stateCount를 가져옴
    getState: function () {
        util.printMsg("현재상태 : ", util.objTostr(this.state.stateCount));
    },

    //showing 전용함수 . 출력형태를 객체전체에서 id,task로 수정 -> "1, 그래픽스 공부" , "4, 블로그쓰기" .. 
    showing: function (key, value) {
        var result = [];
        if (value === "done") {
            for (property in obj) {
                var task = obj[property]['task'];
                var time = obj[property]['runtime'];
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
        this.run();
    },

    //obj[property][id] == index 로 값을 찾아서 state 수정
    //id:index 검색 -> state:value로 수정 ex)setState(1,"done") -> id가 1인 객체의 state를 "done"으로 수정
    //doing으로 update 일때 start 기록, done일때 end 기록 -> 이전시간보다 작다면 state.mintask에 기록
    //현재상태를 출력할때마다 객체순회를 하지않기위해 state에 카운트 변화를 기록
    setState: function (index, value) {
        (this.state.stateCount[value])++;
        if (value === "done") {
            for (property in obj) {
                if (obj[property]['id'] === index) {
                    (this.state.stateCount[obj[property]['state']])--;
                    obj[property]['state'] = value;
                    obj[property]['end'] = Date.now();
                    obj[property]['runtime'] = (obj[property]['end'] - obj[property]['start']) / 1000;
                    if (obj[property]['runtime'] <= this.state.MinTime) {
                        this.state.MinTask = obj[property];
                        this.state.MinTime = obj[property]['runtime'];
                    }
                }
            }
        }
        else if (value === "doing") {
            for (property in obj) {
                if (obj[property]['id'] === index) {
                    (this.state.stateCount[obj[property]['state']])--;
                    obj[property]['state'] = value;
                    obj[property]['start'] = Date.now();
                }
            }
        }
        else {
            for (property in obj) {
                if (obj[property]['id'] === index) {
                    (this.state.stateCount[obj[property]['state']])--
                }
            }
        }
        this.getState();
        this.run();
    },
    //update$id$done 명령어 실행때마다 짧은 task를 state객체에 기록했다가 호출
    getMinTask: function () {
        var get = this.state.MinTask;
        var task = get.task;
        var time = get.runtime;
        var result = "\'" + task + ", " + time + "초\' ";
        util.printMsg(result);
    }

}
todo.run();