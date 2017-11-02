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
    count: { todo: 0, doing: 0, done: 0 },
    minTaskTitle: null,
    minTaskTime: Infinity,
    get counter() {
        return "현재상태 : todo : " + this.count.todo +
            ", doing : " + this.count.doing +
            ", done : " + this.count.done;
    }
}
function stateChanger(state) { }
var TaskMng = {
    taskList: [],
    add: function (title) {
        this.taskList.push(new Task(title));
        Task.prototype.count.todo++;
        console.log("id : " + (this.taskList.length) + " , \"" + title + "\" 항목이 새로 추가됐습니다.")
        console.log(Task.prototype.counter);
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
        var count = Task.prototype.count;
        if (task === undefined) {
            console.log("없는 id!!");
        }
        else {
            count[state]++; count[task.state]--; task.state = state;
            if (state == "doing") {
                task.start = Date.now();
            }
            else if (state == "done") {
                task.end = Date.now();
                task.runtime = (task.end - task.start) / 1000;
                if (task.runtime <= Task.prototype.minTaskTime) {
                    Task.prototype.minTaskTime = task.runtime;
                    Task.prototype.minTaskTitle = task.title;
                }
            }
        }
        console.log(Task.prototype.counter);
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
                if (Task.prototype.minTaskTitle !== null) {
                    console.log(Task.prototype.minTaskTitle + " " + Task.prototype.minTaskTime + "초");
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