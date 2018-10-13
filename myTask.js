
// 할일 관리 애플리케이션 step3 modified 1 

// 할일 추가, 업데이트, 삭제 기능 객체
const todo = {

    // 할일 목록
    todoList: [],

    // 할일 id
    taskId: 0,

    // 현재 상태 출력
    showStatus() {
        const countMap = {
            todo: 0,
            doing: 0,
            done: 0
        }
        this.todoList.forEach(val => {
            countMap[val.status] === 0 ? countMap[val.status] = 1 : countMap[val.status]++
        });
        console.log(`"현재상태 : todo:${countMap.todo}개, doing:${countMap.doing}개, done:${countMap.done}개"\n\n`);
    },

    // 할일 추가
    addTodo(todoInfo) {
        if (checkError.checkIsSameName.call(this, todoInfo)) return; // 에러 검출 메소드 호출
        const info = todoInfo;
        let recentHistory; // 변경 후 내역(할일 추가)
        this.taskId++;

        info.taskId = this.taskId;
        info.status = "todo";
        info.addedTime = new Date().getTime(); // 할일 추가 시간 기록

        this.todoList.push(info);
        for (let val in info) {
            recentHistory = {
                taskId: info.taskId, name: info.name, tag: info.tag, status: info.status,
                addedTime: info.addedTime, startTime: info.startTime, endTime: info.endTime, runningTime: info.runningTime
            };
        }
        printMsgTodo.printAddTodo(info.taskId, info.name); // 메시지 출력
        manageUndoRedo.moveUndoStack(info.taskId, "added", null, recentHistory); // 할일 추가시 undo 스택에 내역 전달 
        this.showStatus();
    },

    // 할일 업데이트
    updateTodo(updateInfo) {
        this.info = updateInfo;
        this.info.nextStatus = this.info.nextStatus.toLowerCase(); // 상태를 소문자로 변경하고 대치

        // 에러 검출 메소드 호출
        if (checkError.checkNotFoundId.call(this, this.info)) return;
        if (checkError.checkIsSameStatus.call(this, this.info)) return;
        if (checkError.checkInvalidUpdate.call(this, this.info)) return;

        this.todoList.filter(val => val.taskId === this.info.id)
            .forEach(this.updateTaskCb.bind(this));
        printMsgTodo.printUpdateTodo(this.info.id, this.taskName, this.prevStatus, this.info.nextStatus); // 메시지 출력 
        manageUndoRedo.moveUndoStack(this.info.id, "updated", this.prevHistory, this.recentHistory); // 할일 업데이트 시 undo 스택에 내역 전달 
        this.showStatus();
    },

    updateTaskCb(val) {
        this.taskName = val.name;
        this.prevHistory = {
            name: val.name, tag: val.tag, taskId: val.taskId, status: val.status,
            addedTime: val.addedTime, startTime: val.startTime, endTime: val.endTime, runningTime: val.runningTime
        };
        this.prevStatus = val.status;
        val.status = this.info.nextStatus; // 상태 업데이트
        this.recordTime(val); // 경과시간 계산 메소드 호출
        this.recentHistory = {
            name: val.name, tag: val.tag, taskId: val.taskId, status: val.status,
            addedTime: val.addedTime, startTime: val.startTime, endTime: val.endTime, runningTime: val.runningTime
        };
    },

    // 업데이트 시 시작시간, 종료시간 기록
    recordTime(todo) { // doing, done 상태 변경시 경과시간을 계산하는 메소드
        if (todo.status === "doing") {
            todo.startTime = new Date().getTime(); // 시작시간 기록
        }
        if (todo.status === "done" && !todo.startTime) { // todo => done으로 변경된 경우
            todo.endTime = new Date().getTime(); // 종료시간 기록
            todo.runningTime = `doing 없이 종료되었습니다. 할일을 추가한 지 ${this.calRunningTime(todo.addedTime, todo.endTime)}가 경과하였습니다.`;
            // 시작시간이 없으므로 추가한 시간을 기준으로 경과시간 계산
        }
        if (todo.status === "done" && todo.startTime) { // doing => done으로 변경된 경우
            todo.endTime = new Date().getTime(); // 종료시간 기록
            todo.runningTime = this.calRunningTime(todo.startTime, todo.endTime);
        }
    },

    // 기록된 시간을 바탕으로 경과시간 계산(종료시간 - 시작시간)
    calRunningTime(addedOrStartTime, endTime) {
        let interval = endTime - addedOrStartTime;
        let days = Math.floor(interval / (1000 * 60 * 60 * 24)); // 경과시간 계산(일) 
        interval -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(interval / (1000 * 60 * 60)); // 경과시간 계산(시간)
        interval -= hours * (1000 * 60 * 60);
        let minutes = Math.floor(interval / (1000 * 60)); // 경과시간 계산(분)
        interval -= minutes * (1000 * 60);
        let seconds = Math.floor(interval / 1000); // 경과시간 계산(초)

        return `${days != 0 ? `${days}일` : ""} ${hours != 0 ? `${hours}시간` : ""} ${minutes != 0 ? `${minutes}분` : ""} ${seconds != 0 ? `${seconds}초` : ""}`.trim();
    },

    // 할 일 삭제
    removeTodo(removeInfo) {
        if (checkError.checkNotFoundId.call(this, removeInfo)) return;
        const info = removeInfo;
        const prevHistory = this.todoList.filter(val => val.taskId === info.id)[0];
        let filterdTodo = this.todoList.filter((val) =>
            val.taskId === info.id
        );
        let taskName = filterdTodo[0].name;
        this.todoList.splice(this.todoList.indexOf(filterdTodo[0]), 1);
        printMsgTodo.printRemoveTodo(info.id, taskName); // 메시지 출력
        manageUndoRedo.moveUndoStack(info.id, "removed", prevHistory, null); // 삭제 내역 기록
        this.showStatus();
    },
} // end todo



// 리스트 출력(태그,상태,일괄) 기능 객체
const printList = {

    // 특정 태그를 기준으로 할일 리스트 생성
    showListByTag(tagName) {
        const listObj = {
            todo: [],
            doing: [],
            done: []
        }
        todo.todoList.filter(val => val.tag === tagName)
            .forEach(val => {
                val.status === "todo" ? listObj.todo.push(val)
                    : val.status === "doing" ? listObj.doing.push(val)
                        : val.status === "done" ? listObj.done.push(val) : undefined;
            });
        this.sortByTaskId(listObj);
        this.printListByTag(listObj);
    },

    // 모든 태그를 기준으로 할일 리스트 생성
    showListByAlltheTags() {
        const listObj = {}
        todo.todoList.filter(val => val.tag)
            .forEach(val => {
                if (!listObj[val.tag]) {
                    listObj[val.tag] = [val];
                } else if (listObj[val.tag]) {
                    listObj[val.tag].push(val);
                }
            });
        this.sortByTaskId(listObj);
        this.printListByAlltheTags(listObj);
    },

    // 생성된 할일 리스트를 아이디 순서로 정렬
    sortByTaskId(listObj) {
        for (let key in listObj) {
            listObj[key].sort((a, b) => a.taskId - b.taskId);
        }
    },

    // 모든 태그를 기준으로 생성 및 정렬된 할일 리스트를 출력
    printListByTag(listObj) {
        for (let key in listObj) {
            if (listObj[key].length !== 0) {
                console.log(`\n[ ${key} , 총 ${listObj[key].length}개 ]`);
            }
            listObj[key].forEach(val =>
                console.log(`- ${val.taskId}번, ${val.name}${val.status === "done" ? `, 경과시간: ${val.runningTime}` : ""}`)
            )
        }
    },

    // 특정 태그를 기준으로 생성 및 정렬된 할일 리스트 출력
    printListByAlltheTags(listObj) {
        for (let key in listObj) {
            if (listObj[key].length !== 0) {
                console.log(`\n[ ${key} , 총 ${listObj[key].length}개 ]`);
            }
            listObj[key].forEach(val =>
                console.log(`- ${val.taskId}번, ${val.name}, [${val.status}]${val.status === "done" ? `, 경과시간: ${val.runningTime}` : ""}`)
            )
        }
    },

    // 현재 상태에 따른 할일 리스트 생성 및 출력
    showListByStatus(status) {
        todo.todoList.filter(val => val.status === status)
            .sort((a, b) => a.taskId - b.taskId) // id 순으로 정렬
            .forEach(val =>
                console.log(`- ${val.taskId}번, ${val.name}, [${val.tag}]${val.status === "done" ? `, 경과시간: ${val.runningTime}` : ""}`)
            )
    },

    // 모든 현재 상태에 따른 할일 리스트 생성
    showAllListByStatus() {
        const listObj = {
            todo: [],
            doing: [],
            done: []
        }
        todo.todoList.forEach(val => {
            val.status === "todo" ? listObj.todo.push(val)
                : val.status === "doing" ? listObj.doing.push(val)
                    : val.status === "done" ? listObj.done.push(val) : undefined;
        });
        this.taskTotalCount = listObj.todo.length + listObj.doing.length + listObj.done.length;
        this.sortByTaskId(listObj);
        this.generateSetTimeout(listObj);
    },

    // 리스트 지연출력 설정
    generateSetTimeout(listObj) {
        console.log(`"총 ${this.taskTotalCount}개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다....."`);

        let repeatCount = 0;
        let milliSec = 2000;
        let status = "todo";

        function repeatSelf(listObj) {
            setTimeout(() => {
                printList.printListBySetTimeout(listObj, status);
                if (repeatCount === 2) return; // 재귀 종료조건
                repeatCount === 0 ? milliSec = 3000 : repeatCount === 1 ? milliSec = 2000 : "";
                repeatCount === 0 ? status = "doing" : repeatCount === 1 ? status = "done" : "";
                console.log(`\n"지금부터 ${milliSec / 1000}초뒤에 ${status}내역을 출력합니다...."`);
                repeatCount += 1;
                repeatSelf(listObj);
            }, milliSec);
        }
        repeatSelf(listObj);
    },

    // 설정된 지연시간에 따라 리스트 출력
    printListBySetTimeout(listObj, status) {
        if (listObj[status].length === 0) {
            console.log(`[ ${status} 항목이 없습니다. ]`);
            return;
        } else {
            console.log(`[ ${status} , 총 ${listObj[status].length}개 ]`);
        }
        listObj[status].forEach(val => {
            console.log(`- ${val.taskId}번, ${val.name}, [${val.tag}]${val.status === "done" ? `, 경과시간: ${val.runningTime}` : ""}`)
        });
    },

} // end printList



// 에러 검출 기능 객체
const checkError = {

    // (에러 검출)존재하지 않는 아이디의 할일 삭제시 에러 메시지 출력 
    checkNotFoundId(target) {
        if (this.todoList.every(val =>
            val.taskId !== target.id)) {
            console.log(`"[error] ${target.id}번 아이디는 존재하지 않습니다."`)
            return true;
        } else {
            return false;
        }
    },

    // (에러 검출)같은 이름의 할일 추가시 에러 메시지 출력
    checkIsSameName(target) {
        if (this.todoList.some(val =>
            val.name === target.name)) {
            console.log(`"[error] 이미 같은 이름의 할일이 존재합니다."`)
            return true;
        } else {
            return false;
        }
    },

    // (에러 검출)같은 상태로 업데이트하려는 경우 에러 메시지 출력
    checkIsSameStatus(target) {
        if (this.todoList.filter(val => val.taskId === target.id)
            .filter(val => val.status === target.nextStatus).length === 1
        ) {
            console.log(`"[error] ${target.id}번은 이미 ${target.nextStatus}입니다."`)
            return true;
        } else {
            return false;
        }
    },

    // (에러 검출)부적절한 상태로 업데이트하려는 경우 에러 메시지 출력
    checkInvalidUpdate(target) {
        if (this.todoList.filter(val => val.taskId === target.id)
            .filter(val =>
                (val.status === "done" && target.nextStatus === "doing") ||
                (val.status === "done" && target.nextStatus === "todo")
            ).length === 1) {
            console.log(`"[error] done 상태에서 ${target.nextStatus} 상태로 갈 수 없습니다."`)
            return true;
        } else {
            return false;
        }
    },

} // end checkError



// undo, redo 기능 구현 객체
const manageUndoRedo = {

    // undo 스택
    undoStack: [],

    // redo 스택
    redoStack: [],

    // (스택) 활동 내역에 대한 변경전, 변경후 상태를 undo스택에 추가
    moveUndoStack(taskId, statusLog, prevHistory, recentHistory) {
        logObj = {};
        logObj.taskId = taskId;
        logObj.statusLog = statusLog;
        logObj.prevHistory = prevHistory;
        logObj.recentHistory = recentHistory;
        this.manageUndoStack(logObj);
    },

    // (스택)undo스택 관리
    manageUndoStack(logObj) {
        if (this.undoStack.length < 3) {
            this.undoStack.push(logObj);
        } else if (this.undoStack.length >= 3) {
            this.undoStack.splice(0, 1);
            this.undoStack.push(logObj);
        }
    },

    // (스택)redo스택 관리
    manageRedoStack() {
        if (this.redoStack.length > 3) {
            this.redoStack.splice(this.redoStack.length - 1, 1);
        }
    },

    // (스택)undo 기능 
    undo() { // 변경 후 상태를 변경 전 상태로 대치 
        this.endIndex = this.undoStack.length - 1
        if (this.undoStack.length != 0) { // 스택이 차지 않았을 경우 코드 실행
            this.searchId = this.undoStack[this.endIndex].taskId; // 해당 ID 찾기
            this.statusLog = this.undoStack[this.endIndex].statusLog;

            todo.todoList.forEach(this.replaceBackCb.bind(this));

            if (this.statusLog === "removed") {
                todo.todoList.push(this.undoStack[this.endIndex].prevHistory);
                printMsgUndoRedo.printUndoMsgRecovered(this.searchId, this.undoStack[this.endIndex].prevHistory.name); // 메시지 출력
            }
            this.redoStack.unshift(this.undoStack.splice(this.endIndex, 1)[0]); // redo 스택으로 이동 
            this.manageRedoStack() //  redo 스택 횟수 초과시 마지막 내역 삭제
        } else if (this.undoStack.length === 0) { // 스택이 꽉 찰 경우 undo 불가
            console.log(`"더 이상 undo할 수 없습니다."`)
        }
    },

    // (스택)undo forEach 콜백
    replaceBackCb(val, idx) {
        if (val.taskId === this.searchId && this.statusLog === "updated") {
            todo.todoList[idx] = this.undoStack[this.endIndex].prevHistory;
            printMsgUndoRedo.printUndoMsgUpdated( // 메시지 출력
                this.searchId, this.undoStack[this.endIndex].prevHistory.name,
                this.undoStack[this.endIndex].recentHistory.status, this.undoStack[this.endIndex].prevHistory.status
            );
        }
        if (val.taskId === this.searchId && this.statusLog === "added") {
            todo.todoList.splice(idx, 1);
            printMsgUndoRedo.printUndoMsgRemoved(this.searchId, this.undoStack[this.endIndex].recentHistory.name); // 메시지 출력
        }
    },

    // (스택)redo 기능 
    redo() { // 다시 변경 후 상태로 대치 
        if (this.redoStack.length != 0) { // 스택이 차지 않았을 경우 코드 실행
            this.searchId = this.redoStack[0].taskId;
            this.statusLog = this.redoStack[0].statusLog;

            todo.todoList.forEach(this.replaceAgainCb.bind(this));

            if (this.statusLog === "added") {
                todo.todoList.push(this.redoStack[0].recentHistory);
                printMsgUndoRedo.printRedoMsgAdded(this.searchId, this.redoStack[0].recentHistory.name); // 메시지 출력
                todo.showStatus()
            }
            this.undoStack.push(this.redoStack.splice(0, 1)[0]); // undo 스택으로 이동
        } else if (this.redoStack.length === 0) {  // 스택이 꽉 찰 경우 redo 불가
            console.log(`"더 이상 redo할 수 없습니다."`);
        }
    },

    // (스택)redo forEach 콜백
    replaceAgainCb(val, idx) {
        if (val.taskId === this.searchId && this.statusLog === "updated") {
            todo.todoList[idx] = this.redoStack[0].recentHistory;
            printMsgUndoRedo.printRedoMsgUpdated( // 메시지 출력
                this.searchId, this.redoStack[0].prevHistory.name,
                this.redoStack[0].prevHistory.status, this.redoStack[0].recentHistory.status
            );
            todo.showStatus()
        }
        if (val.taskId === this.searchId && this.statusLog === "removed") {
            todo.todoList.splice(idx, 1);
            printMsgUndoRedo.printRedoMsgRemoved( // 메시지 출력
                this.searchId, this.redoStack[0].prevHistory.name,
                this.redoStack[0].prevHistory.status
            );
            todo.showStatus()
        }
    }

} // end manageUndoRedo 



// 할일 추가, 업데이트, 삭제 메시지 출력 기능 객체
const printMsgTodo = {

    printAddTodo(...args) {
        console.log(`"id: ${args[0]}, '${args[1]}' 항목이 새로 추가되었습니다."`);
    },

    printUpdateTodo(...args) {
        console.log(`"id: ${args[0]}, '${args[1]}' 항목이 ${args[2]} => ${args[3]} 상태로 업데이트되었습니다."`);
    },

    printRemoveTodo(...args) {
        console.log(`"id: ${args[0]}, '${args[1]}' 삭제완료"`);
    }

} // end printMsgTodo



// undo, redo 결과 메시지 출력 기능 객체 
const printMsgUndoRedo = {

    printUndoMsgRecovered(...args) {
        console.log(`"${args[0]}번, '${args[1]}' 항목을 복구했습니다."`);
    },

    printUndoMsgUpdated(...args) {
        console.log(`"${args[0]}번, '${args[1]}' 항목이 ${args[2]} => ${args[3]} 상태로 업데이트 복구되었습니다."`);
    },

    printUndoMsgRemoved(...args) {
        console.log(`"${args[0]}번, '${args[1]}'(이)가 삭제되었습니다."`);
    },

    printRedoMsgAdded(...args) {
        console.log(`"${args[0]}번, '${args[1]}' 항목이 다시 추가되었습니다."`);
    },

    printRedoMsgUpdated(...args) {
        console.log(`"${args[0]}번, '${args[1]}' 항목이 ${args[2]} => ${args[3]} 상태로 다시 업데이트되었습니다."`);
    },

    printRedoMsgRemoved(...args) {
        console.log(`"${args[0]}번, '${args[1]}'(이)가 ${args[2]}상태에서 다시 삭제되었습니다."`);
    }

} // end printMsgUndoRedo



// 메소드 호출 및 실행 

// 할일 추가
// todo.addTodo({ name: "자바스크립트 공부", tag: "programming" });
// todo.addTodo({ name: "알고리즘 문제", tag: "programming" });
// todo.addTodo({ name: "스켈레톤 코드 디자인", tag: "programming" });
// todo.addTodo({ name: "ajax와 비동기 처리", tag: "programming" });
// todo.addTodo({ name: "산책", tag: "hobby" });
// todo.addTodo({ name: "헌혈", tag: "hobby" });
// todo.addTodo({ name: "사진보정", tag: "hobby" });
// todo.addTodo({ name: "사진찍기", tag: "hobby" });
// todo.addTodo({ name: "서점들르기", tag: "life" });
// todo.addTodo({ name: "맨손운동", tag: "life" });
// todo.addTodo({ name: "편의점 생수 1팩 구입", tag: "life" });
// todo.addTodo({ name: "친구약속(광화문)", tag: "life" });
// todo.addTodo({ name: "현대사 읽기", tag: "study" });


// 할일 업데이트
// todo => doing
// todo.updateTodo({ id: 1, nextStatus: "DoinG" });
// todo.updateTodo({ id: 2, nextStatus: "DoinG" });
// todo.updateTodo({ id: 3, nextStatus: "DoinG" });
// todo.updateTodo({ id: 5, nextStatus: "DoinG" });
// todo.updateTodo({ id: 7, nextStatus: "dOiNg" });

// doing => done

// todo.updateTodo({ id: 1, nextStatus: "DoNe" });
// todo.updateTodo({ id: 2, nextStatus: "DoNe" });
// todo.updateTodo({ id: 3, nextStatus: "DoNe" });
// todo.updateTodo({ id: 5, nextStatus: "DoNe" });
// todo.updateTodo({ id: 7, nextStatus: "DoNe" });

// todo = done
// todo.updateTodo({ id: 9, nextStatus: "donE" });
// todo.updateTodo({ id: 10, nextStatus: "doNE" });

// 할일 삭제(및 중복 삭제)
// todo.removeTodo({ id: 1 });
// todo.removeTodo({ id: 13 });
// todo.removeTodo({ id: 1 });
// todo.removeTodo({ id: 13 });


// todo.showListByTag("programming"); 
// todo.showListByTag("hobby"); 
// todo.showListByTag("life"); 
// todo.showListByTag("study"); 

//todo.showListByStatus("todo");
// todo.showListByStatus("doing");
// todo.showListByStatus("done");

//todo.showAllListByStatus(); 