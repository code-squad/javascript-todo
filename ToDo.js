/* 
    객체로 코드구현
*/

class TODO {

    constructor() {
        this.todoListDataGroup = new Array();
    }

    addWorkTodo(content) {
        const paddingIndex = 1;

        const idCount = this.todoListDataGroup.length + paddingIndex;
        const createdDate = new Date();

        const workObj = {
            id: idCount,
            content: content,
            state: "todo",
            createTime: createdDate.toLocaleString(),
            TimeToDoing: 0,
            TimeToDone: 0,

            calcualateDoneTime: function() {
                return this.TimeToDone - this.TimeToDoing;
            }
        };

        this.todoListDataGroup.push(workObj);

        // 출력
        log("id: " + idCount + ", " + "\"" + content + "\" 항목이 새로 추가됐습니다.");
        print.currentState(this.todoListDataGroup);
    }

    printWorkList(state) {
        let content = "";
        let result = "";
        const mode = (state === "todo") ? "TO DO" : (state === "doing") ? "DOING" : "DONE";
    
        log(" << " + mode + " 상태인 목록을 출력합니다 >> ");

        const doneWorkList = this.todoListDataGroup.filter(work => {
            return work.state === state;
        });

        doneWorkList.forEach(work => {
            if (work.state === "DONE") {
                result = print.doneWorkList(work);
            } else {
                content = "\"" + work.id + ". " + work.content + "\"";
                result += content;
            }
        });
    
        result = (result === "") ? "해당 상태인 목록이 없습니다" : result;
    
        log(result);
    }

    updateWorkState(id, content) {
        let forIndexMatchingData = 1;
        let index = id - forIndexMatchingData;
    
        log(" << " + id + " 번의 상태를 '" + this.todoListDataGroup[index].state + "' 에서 '" + content + "' 로 변경합니다 >> ");
    
        this.todoListDataGroup[index].state = content;
    
        if (content === "doing") {
            this.todoListDataGroup[index].TimeToDoing = Date.now();
        } else if (content === "done") {
            this.todoListDataGroup[index].TimeToDone = Date.now();
        }
        
        print.currentState(this.todoListDataGroup);
    }
}

// 예약어 느낌이라 피하려고 했는데
// printDoneWorkList => print.doneWorkList
// 이런식으로 이어지게 하기 위해서 일단 적용했습니다.
// 그래도 예약어를 피하고 다른 네이밍을 짓는게 낫겠죠?
// printOut ?
const print = {

    doneWorkList : function(data) {
        const millisecondTime = data.calcualateDoneTime();
        const calculatedTime = Math.floor(millisecondTime / 1000);
        let minute = Math.floor(calculatedTime / 60);
        let hour = Math.floor(minute / 60);
        let second = calculatedTime;
        let result = "";
    
        minute -= (hour * 60);
        second -= ((hour * 3600) + (minute * 60));
        result = "\"" + data.id + ". " + data.content + "\", " + 
                 "완료 시간 : " + hour + "시간 " + minute + "분 " + second + "초";
    
        return result;
    },

    currentState : function(workList) {
        let todoCount = 0;
        let doingCount = 0;
        let doneCount = 0;
    
        let state = "";

        workList.forEach(work => {
            state = work.state;
            if (state === "todo") {
                todoCount++;
            } else if (state === "doing") {
                doingCount++;
            } else {
                doneCount++;
            }
        });
    
        log("현재상태 : " + "todo " + todoCount + "개, doing : " + doingCount + "개, done : " + doneCount + "개");
    }
};

function command(data) {
    // class 생성
    let todoListClass = singleton.getInstance();
    let todoList = todoListClass.todoList;

    // $ 문자 구분
    const result = data.split("$");
    const mode = result[0];
    let content = result[1];
    let replaceTargetIndex = "";
    // switch-case
    switch(mode) {
        case "add":
        todoList.addWorkTodo(content);
         break;
        case "show":
        todoList.printWorkList(content);
         break;
        case "update":
         replaceTargetIndex = result[1];
         content = result[2];
         todoList.updateWorkState(replaceTargetIndex, content);
         break;
    }
}

function log(data) {
    console.log(data);
}

let run = function () {

    let todoList = new TODO();

    command("add$자바스크립트 공부하기");
    command("show$todo");
    command("update$1$doing");

    setTimeout(function() {
        command("update$1$done");
        command("show$todo");
        command("show$doing");
        command("show$done");
    }, 3000);
};

// singleton을 만든 이유는
// todoListDataGroup 때문입니다.
// 저는 이렇게 해결했는데 맞는지 모르겠네요.

// 일단은 todoListDataGroup을 class안으로 밀어(?)버렸습니다.
// 그리고 코드를 수행하니, command 함수에서 계속 new TODO() 를 해버리니
// 데이터가 보존되지 않고 초기화가 되어버리더군요.

// 그래서 데이터를 어떻게 보관할까 하다가 처음에는
// todoList 의 undefined 를 체크했습니다
// 하지만 어차피 command 도 함수라서, 밖에 존재하는 run 함수에서
// 데이터를 전달해주지 않는 이상 똑같은 결과(보존되지 않는)가 발생하더군요.

// 하지만 run 함수에서 전달시키기는 뭔가 내키지 않았습니다.
// todoListDataGroup를 넘겨주는것과 비슷해보여서요.
// 그래서 디자인패턴 중 Singleton을 적용하게 된것입니다.

// 더 좋은 방법이 있다면 알려주세요 @crong ! 배우고싶어요 :)
let singleton = (function() {
    var instance;
    let a;
    let todoList;

    function initiate() {
        return {
            todoList: new TODO()
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = initiate();
            }
            return instance;
        }
    }
})();

run();
