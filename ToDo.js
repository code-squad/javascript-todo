/* 
    객체로 코드구현
*/

const todo = class {

    constructor(works) {
        this.works = works;
    }

    addWorkTodo(content) {
        const forIndexMatchingData = 1;

        let idCount = this.works.length + forIndexMatchingData;
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

        // works.push(workObj);
        this.works.push(workObj);

        // 출력
        log("id: " + idCount + ", " + "\"" + content + "\" 항목이 새로 추가됐습니다.");
        printCurrentState(this.works);
    }

    showWorkList(state) {
        let content = "";
        let result = "";
        let mode = (state === "todo") ? "TO DO" : (state === "doing") ? "DOING" : "DONE";
    
        log(" << " + mode + " 상태인 목록을 출력합니다 >> ");
    
        for(let i=0; i<this.works.length; i++) {
            if (this.works[i].state === state && mode === "DONE") {
                result = printDoneWorkList(this.works[i])
            } else if (this.works[i].state === state) {
                content = "\"" + this.works[i].id + ". " + this.works[i].content + "\"";
                result += content;
            }
        }
    
        result = (result === "") ? "해당 상태인 목록이 없습니다" : result;
    
        log(result);
    }

    updateWorkState(id, content) {
        let forIndexMatchingData = 1;
        let index = id - forIndexMatchingData;
    
        log(" << " + id + " 번의 상태를 '" + this.works[index].state + "' 에서 '" + content + "' 로 변경합니다 >> ");
    
        this.works[index].state = content;
    
        if (content === "doing") {
            this.works[index].TimeToDoing = Date.now();
        } else if (content === "done") {
            this.works[index].TimeToDone = Date.now();
        }
        
        printCurrentState(this.works);
    }
}

function command(works, data) {
    // class 생성
    var todoClass = new todo(works);

    // $ 문자 구분
    let result = data.split("$");
    let mode = result[0];
    let content = result[1];
    let replaceTargetIndex = "";
    // switch-case
    switch(mode) {
        case "add":
         todoClass.addWorkTodo(content);
         break;
        case "show":
         todoClass.showWorkList(content);
         break;
        case "update":
         replaceTargetIndex = result[1];
         content = result[2];
         todoClass.updateWorkState(replaceTargetIndex, content);
         break;
    }
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

function printCurrentState(works) {

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
