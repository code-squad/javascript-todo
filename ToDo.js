/* 
    객체로 코드구현
*/

class Todo {

    constructor(todoListDataGroup, output) {
        this.todoListDataGroup = new Array();
        this.output = new OutputTodo();
    }

    add(content) {
        const paddingIndex = 1;
        const createdDate = new Date();
        const workObj = {
            id: this.todoListDataGroup.length + paddingIndex,
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

        log("id: " + workObj.id + ", " + "\"" + content + "\" 항목이 새로 추가됐습니다.");
        this.output.currentState(this.todoListDataGroup);
    }

    show(state) {
        let content = "";
        let result = "";
        const mode = (state === "todo") ? "TO DO" : (state === "doing") ? "DOING" : "DONE";
    
        log(" << " + mode + " 상태인 목록을 출력합니다 >>");

        const doneWorkList = this.todoListDataGroup.filter(work => {
            return work.state === state;
        });

        doneWorkList.forEach(work => {
            if (work.state === "DONE") {
                result = output.doneWorkList(work);
            } else {
                content = "\"" + work.id + ". " + work.content + "\"";
                result += content;
            }
        });
    
        result = (result === "") ? "해당 상태인 목록이 없습니다" : result;
    
        log(result + "\n");
    }

    update(id, content) {
        let forIndexMatchingData = 1;
        let index = id - forIndexMatchingData;
    
        log(" << " + id + " 번의 상태를 '" + this.todoListDataGroup[index].state + "' 에서 '" + content + "' 로 변경합니다 >>");
    
        this.todoListDataGroup[index].state = content;
    
        if (content === "doing") {
            this.todoListDataGroup[index].TimeToDoing = Date.now();
        } else if (content === "done") {
            this.todoListDataGroup[index].TimeToDone = Date.now();
        }
        
        this.output.currentState(this.todoListDataGroup);
    }

    command(stringData) {
        // 이 문법은 꼭.. 신세계
        let [mode, parameterFirstValue, parameterSecondValue] = stringData.split("$");
        // 해당 함수의 이름이 동일해야함
        this[mode] (parameterFirstValue, parameterSecondValue);
    }

    // 클래스의 구조를 파악하기 위한 메서드입니다 (get, set)
    getTodoArrayData() {
        return this.todoListDataGroup;
    }

    setTodoArrayData(todoListDataGroup) {
        this.todoListDataGroup = todoListDataGroup;
    }
}

class OutputTodo {

    doneList(data) {
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
    }

    currentState(workList) {
        let todoCount = 0;
        let doingCount = 0;
        let doneCount = 0;

        workList.forEach(work => {
            let state = work.state;

            if (state === "todo") {
                todoCount++;
            } else if (state === "doing") {
                doingCount++;
            } else {
                doneCount++;
            }
        });
    
        log("현재상태 : " + "todo " + todoCount + "개, doing : " + doingCount + "개, done : " + doneCount + "개\n");
    }
};

function log(data) {
    console.log(data);
}

let run = function () {

    const todoList = new Todo();

    todoList.command("add$자바스크립트 공부하기");

    log(todoList.getTodoArrayData()); // get 테스

    todoList.command("show$todo");
    todoList.command("update$1$doing");

    setTimeout(function() {
        todoList.command("update$1$done");
        todoList.command("show$todo");
        todoList.command("show$doing");
        todoList.command("show$done");
    }, 3000);
};

run();
