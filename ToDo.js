/* 
    소요시간 계산
    완료 상태가 되면, 진행중부터 완료까지 소요된 시간을 알 수 있으면 좋겠다. 
    예를들어 공부하기라는 task가 얼마나 걸렸는지 알고 싶을 수 있다. 
    이때 시간단위로 몇시간 걸렸는지 알 수 있게 날짜를 기반으로 시간을 계산해보자.

    > "show$done;
    > 'iOS공부하기, 3시간10분', '자바스크립트공부하기, 9시간31분', '주간회의 1시간40분'

    이런식으로 task가 doing => done까지의 소요시간을 계산해서, 출력하도록 한다.
*/

function command(works, data) {
    // $ 문자 구분
    let result = data.split("$");
    let mode = result[0];
    let content = result[1];
    let replaceTargetIndex = "";
    // switch-case
    switch(mode) {
        case "add":
         addWorkToDo(works, content);
         break;
        case "show":
         showWorkList(works, content);
         break;
        case "update":
         replaceTargetIndex = result[1];
         content = result[2];
         updateWorkState(works, replaceTargetIndex, content);
         break;
    }
}

function addWorkToDo(works, content) {
    // Obj를 새로 생성해서

    // ID 값 계산
    // 배열의 Index 를 Id 로 체크하면 될 듯 함

    // 배열에 추가

    const forIndexMatchingData = 1;

    let idCount = works.length + forIndexMatchingData;
    let date = new Date();

    var workObj = {
        id: idCount,
        content: content,
        state: "todo",
        createTime: date.toLocaleString(),
        TimeToDoing: 0,
        TimeToDone: 0,

        calDoneTime: function() {
            return this.TimeToDone - this.TimeToDoing;
        }
    };

    works.push(workObj);

    // 출력
    log("id: " + idCount + ", " + "\"" + content + "\" 항목이 새로 추가됐습니다.");
    printCurrentState(works);
}

function showWorkList(works, state) {
    // todo인지, doing인지, done인지
    // 배열을 순차적으로 탐색하면서
    // state 값을 판별해서 맞는 state 만 출력

    // ID, 내용 순으로 출력

    let content = "";
    let result = "";
    let mode = (state === "todo") ? "TO DO" : (state === "doing") ? "DOING" : "DONE";

    log(" << " + mode + " 상태인 목록을 출력합니다 >> ");

    for(let i=0; i<works.length; i++) {
        if (works[i].state === state && mode === "DONE") {
            result = printDoneWorkList(works[i])
        } else if (works[i].state === state) {
            content = "\"" + works[i].id + ". " + works[i].content + "\"";
            result += content;
        }
    }

    result = (result === "") ? "해당 상태인 목록이 없습니다" : result;

    log(result);
}

function printDoneWorkList(data) {

    let millisecondTime = data.calDoneTime();
    let calculatedTime = Math.floor(millisecondTime / 1000);
    let minute = Math.floor(calculatedTime / 60);
    let hour = Math.floor(minute / 60);
    let second = calculatedTime;
    let result = "";

    minute -= (hour * 60);
    second -= ((hour * 60 * 60) + (minute * 60));
    result = "\"" + data.id + ". " + data.content + "\", " + 
             "완료 시간 : " + hour + "시간 " + minute + "분 " + second + "초";

    return result;
}

function updateWorkState(works, id, content) {
    // 해당 ID 값을 상태로 바꿔주는 기능으로 구현
    // ID에 맞게 해당 state를 수정 후

    // 2번째 요구사항
    // Doing 상태로 바뀔 때 시간체크
    // Done 상태로 바뀔 때 시간체크

    let forIndexMatchingData = 1;
    let index = id - forIndexMatchingData;

    log(" << " + id + " 번의 상태를 '" + works[index].state + "' 에서 '" + content + "' 로 변경합니다 >> ");

    works[index].state = content;

    if (content === "doing") {
        works[index].TimeToDoing = Date.now();
    } else if (content === "done") {
        works[index].TimeToDone = Date.now();
    }
    
    printCurrentState(works);
}

function printCurrentState(works) {
    // 현재상태 출력

    // 배열을 순차적으로 탐색하면서
    // state의 값을 카운트 하며 
    // todo, doing, done 갯수 출력

    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;

    let state = "";

    for (let i=0; i < works.length; i++) {
        state = works[0].state;
        if (state === "todo") {
            todoCount++;
        } else if (state === "doing") {
            doingCount++;
        } else {
            doneCount++;
        }
    }

    log("현재상태 : " + "todo " + todoCount + "개, doing : " + doingCount + "개, done : " + doneCount + "개");
}

function log(data) {
    console.log(data);
}

var run = function () {
    var works = [];

    command(works, "add$자바스크립트 공부하기");
    command(works, "show$todo");

    command(works, "update$1$doing");
    setTimeout(function() {
        command(works, "update$1$done");
        command(works, "show$done");
    }, 3000);
};

run();
