/*
할일을 추가할 수 있다.
할일이 추가되면 id 값을 생성하고 결과를 알려준다.
상태는 3가지로 관리된다. todo, doing, done.
각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
명령어를 입력시이 '$'를 구분자로 사용해서 넣는다.
> "add$자바스크립트 공부하기";
> id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 이렇게 출력
> 현재상태 :  todo:1개, doing:2개, done:2개

> "show$doing;
> "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

> "show$done;
> //완료한 목록노출.(doing와 동일한 구조로 출력)

> "update$3$done;
> 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.
*/

//nodjs에서 제공하는 모듈(라이브러리)를 불러온다. 
const readline = require('readline');

//불러온 readline을 사용할 수 있게 초기화를 한다. 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//이어붙여서 출력
function printMsg() {
    var result = [];
    for (var i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }
    console.log(result);
}
const obj = [
    {
        id: 1,
        task: "자바스크립트 공부",
        state: "doing"
    },
    {
        id: 2,
        task: "그래픽스 공부",
        state: "todo"
    },
    {
        id: 3,
        task: "낮잠자기",
        state: "done"
    },
    {
        id: 4,
        task: "간식먹기",
        state: "doing"
    },
    {
        id: 5,
        task: "만화보기",
        state: "done"
    }
]

//배열을 순회하며 state count 를 출력
function getState() {
    var flag = { todo: 0, doing: 0, done: 0 };
    for (property in obj) {
        flag[obj[property]['state']]++;
    }
    printMsg("현재상태 : ", objTostr(flag));
}

//object를 string 으로 변환하여 출력
//obj = [ { id: 1, task: "자바스크립트 공부", state: "doing" } -> id:1 task:자바스크립트 공부 state:doing
function objTostr(target) {
    var result = "";
    for (property in target) {
        if (target[property].constructor == 'object') objTostr(target[property]);
        else result += property + ":" + target[property] + " ";
    }
    return result;
}

//add 명령어 함수. 배열의 마지막 객체의 id값을 1증가하여 id생성. 매개변수를 task명으로 넣고 현재상태출력
function add(task) {
    var id = 1;
    id += obj[obj.length - 1]['id'];
    obj[obj.length] = { "id": id, "task": task, "state": "todo" };
    printMsg("id : ", id, "  \"", task, "\" 항목이 새로 추가됬습니다.")
    getState();
}

//객체를 순회하며 key:value 가 있는 객체를 출력
function getObj(key, value) { //key로 서치. ex)getObj("task","간식먹기") getState 랑 살짝겹침
    for (property in obj) {
        if (obj[property][key] === value) printMsg(objTostr(obj[property]));
    }
    start();
}

//showing 전용함수 . 출력형태를 객체전체에서 id,task로 수정 -> "1, 그래픽스 공부" , "4, 블로그쓰기" .. 
function showing(key, value) {
    var result = [];
    for (property in obj) {
        if (obj[property][key] === value)
            result += "\"" + obj[property]['id'] + ", " + obj[property]['task'] + "\"  ";
    }
    printMsg(result);
    start();
}

//key:value 를 검색해서 value->value2로 수정 
//ex)setState("state","doing","done") -> state가 doing인 객체의 state를 done으로 수정
function setValue(key, value, value2) {
    for (property in obj) {
        if (obj[property][key] === value) {
            obj[property][key] = value2;
        }
    }
}

//obj[property][id] == index 로 값을 찾아서 state 수정
//매개변수가 '부족'할때만 에러메세지 update$index$state -> 3개
//id:index 검색 -> state:value로 수정 ex)setState(1,"done") -> id가 1인 객체의 state를 "done"으로 수정
function setState(index, value) {
    for (property in obj) {
        if (obj[property]['id'] === index) {
            obj[property]['state'] = value;
        }
    }
    getState();
    start();
}
//시작지점 종료입력이 나오기전까지 작동
function start() {
    rl.question("\ncmd: add showing update exit\n>", function (answer) {
        var allcmd = ["add", "showing", "update", "exit"];
        var cmd = answer.split("$")[0]; //answer = add$test -> answer.split("$")[0] = add
        var check = Number(allcmd.indexOf(cmd)); //allcmd.indexOf(cmd)); //-1일경우 없는 명령어

        if (check == -1) {
            printMsg("wrong input!");
            start();
        }
        else {
            if (check === 0) { // check = 0
                add(answer.split("$")[1]);
                start();
            }
            else if (cmd === "showing") { // check == 1
                showing("state", answer.split("$")[1]);
                start();
            }
            else if (cmd === "update") { // check == 2
                setState(Number(answer.split("$")[1]), answer.split("$")[2]);
                start();
            }
            else if (cmd === "exit") {
                printMsg("Do your Best!");
                rl.close();
            }
            else rl.close();
        }
    });
}
start();
//getState();
//rl.close();