/* 
    할일관리 프로그램
    할일을 추가할 수 있다.
    할일이 추가되면 id 값을 생성하고 결과를 알려준다.
    상태는 3가지로 관리된다. todo, doing, done.
    각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
    각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
    명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.

    command("add$자바스크립트 공부하기");
    > id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 출력
    > 현재상태 :  todo:1개, doing:2개, done:2개

    command("show$doing");
    > "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

    command("show$done");
    > //완료 목록을 위 doing과 같은 형태로 노출한다.

    command("update$3$done");
    > 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.
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

    var workObj = {
        id: idCount,
        content: content,
        state: "todo"
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
        if (works[i].state == state) {
            content = "\"" + works[i].id + ". " + works[i].content + "\"";
            result += content;
        }
    }

    result = (result === "") ? "해당 상태인 목록이 없습니다" : result;

    log(result);
}

function updateWorkState(works, id, content) {
    // 해당 ID 값을 상태로 바꿔주는 기능으로 구현
    // ID에 맞게 해당 state를 수정 후

    let forIndexMatchingData = 1;
    let index = id - forIndexMatchingData;

    works[index].state = content;
    
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
    command(works, "show$doing");
    command(works, "show$done");
    command(works, "update$1$done");
    
    command(works, "show$todo");
    command(works, "show$done");
};

run();
