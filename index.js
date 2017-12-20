var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line',function (input) {
    var result = interpreter.excute(input);
    app[result.command].apply(app,result.param);
    
});

function Task(content) {
    this.id = this.addId();
    this.status = 'todo';
    this.content = content;
}

/**
 * TIL
 * 클로저를 이용. id변수를 즉시실행(1회만실행)으로 만든후
 * 클로저를 이용해 id변수가 사라지지 않고 계속 참조하게 한다.
 */

Task.prototype.addId = (function () {
    var id = 1;
    return function () {
        return id++;
    }
})();

var app = {
    taskList: [], //[{id:1,status:doing,content:밥주기}]
    count :{
        todo: 0,
        doing: 0,
        done: 0
    },
    show: function (status) {
        var tasks = this.taskList.filter(function (task) {
            return task.status === status;
        });

        tasks.forEach(function (task) {
            console.log('"',task.id,',',task.content,'"');
        });
    },
    add: function (content) {
        var newTask = new Task(content);
        this.taskList.push(newTask);
        this.count.todo++;
        console.log('id: ',newTask.id,',',newTask.content,'항목이 새로 추가됐습니다.');
        this.showCurrentStatus();
    },
    showCurrentStatus: function(){
        console.log('현재상태: todo: '+this.count.todo+'개, '
            +'doing: '+this.count.doing+'개, '
            +'done: '+this.count.done+'개');
    },
    update: function (id,status) {


    }
};

/**
 * TIL
 * 리턴값으로 객체
 */
var interpreter = {
    excute: function (input) {
        var params = input.split('$');
        var command = params[0];
        var param = params.shift();

        return {
            command: command,
            param: param
        }
    }
};
