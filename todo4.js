var util = require('./util.js');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function Task(title) {
    this.id = TaskMng.taskList.length + 1;
    this.title = title;
    this.state = 'todo';
    this.start = null;
    this.end = null;
    this.runtime = null;
}
Task.prototype = {
    setRunTime: function () {
        this.end = Date.now();
        this.runtime = (this.end - this.start) / 1000;
    },
    get getRuntime() {
        return this.runtime;
    },
    get getTitle() {
        return this.title;
    }
}
var TaskMng = {
    taskList: [],
    count: { todo: 0, doing: 0, done: 0 },
    minTaskTitle: null,
    minTaskTime: Infinity,
    get counter() {
        return "현재상태 : todo : " + this.count.todo +
            ", doing : " + this.count.doing +
            ", done : " + this.count.done;
    },
    add: function (title) {
        this.taskList.push(new Task(title));
        this.count.todo++;
        console.log("id : " + (this.taskList.length) + " , \"" + title + "\" 항목이 새로 추가됐습니다.")
        console.log(this.counter);
    },

    show: function (state) {
        var task = this.taskList;
        var result = [];
        if (state === "done") {//state,[출력key] -> 결과 반환 함수만들기
            for (property in task) { //property 는 인덱스(스트링이지만) -> 각괄호접근
                if (task[property]["state"] == state) {
                    result += "\"" + task[property].title + ", " + task[property].runtime + "초\" ";
                }
            }
        }
        else {
            for (property in task) {
                if (task[property]["state"] == state) {
                    result += "\"" + task[property].id + ", " + task[property].title + "\" ";
                }
            }
        }
        if (result.length !== 0) console.log(result);
    },
    update: function (id, state) {
        this.index = id - 1;
        var task = this.taskList[this.index];
        var count = this.count;
        if (task === undefined) {
            console.log("없는 id!!");
        }
        else {
            count[state]++; count[task.state]--; task.state = state;
            if (state == "doing") {
                task.start = Date.now();
            }
            else if (state == "done") {
                task.setRunTime();
                if (task.getRuntime <= this.minTaskTime) {
                    this.minTaskTime = task.getRuntime;
                    this.minTaskTitle = task.getTitle;
                }
            }
        }
        console.log(this.counter);
    },
};

var todo = {
    run: function () {
        rl.question("\n명령어 : add show update mintask exit\n>", function (answer) {
            var cmd = ["add", "show", "update"];
            var input = answer.split("$");
            var first = input[0];
            if (cmd.indexOf(first) !== -1) {
                if (util.cmdChecker(input)) {
                    input.shift();
                    TaskMng[first].apply(TaskMng, input);
                }
            }
            else if (first === "mintask") {
                if (TaskMng.minTaskTitle !== null) {
                    console.log(TaskMng.minTaskTitle + " " + TaskMng.minTaskTime + "초");
                }
                else console.log("빈 저장목록");
            }
            else if (first === "exit") {
                console.log("bye!");
                process.exit();
            }
            else {
                console.log("잘못된 명령어 : " + first)
            }
            todo.run();
        });
    }
}
todo.run();