
// 할 일 관리 어플리케이션 step2 

// 네임 스페이스
const todo = {

    // 할일 목록
    todoList: [],

    // 할일 id
    taskId: 0,

    // 현재 상태 출력
    showStatus() {
        const result = {};
        const countMap = {
            todo: 0,
            doing: 0,
            done: 0
        }
        this.todoList.forEach(val => {
            countMap[val.status] === 0 ? countMap[val.status] = 1 : countMap[val.status]++
        });
        console.log(`현재상태 : todo:${countMap.todo}개, doing:${countMap.doing}개, done:${countMap.done}개\n\n`);
    },

    // 할일 추가
    addTodo(todoInfo) {
        const info = todoInfo;
        this.taskId++;
        info.taskId = this.taskId;
        info.status = "todo";
        this.todoList.push(info);
        console.log(`id: ${info.taskId}, "${info.name}" 항목이 새로 추가되었습니다.`);
        this.showStatus();
    },

    // 할일 업데이트
    updateTodo(updateInfo) {
        const info = updateInfo;
        let prevStatus;
        let taskName;
        info.nextStatus = info.nextStatus.toLowerCase(); // 상태를 소문자로 변경하고 대치
        this.todoList.filter(val => val.taskId === info.id)   // 인자로 넘겨받은 아이디와 할일리스트의 아이디가 같은 것을 필터링
            .forEach(val => {
                taskName = val.name;  // 할일리스트의 이름 다른 변수에 저장(콘솔 출력을 위해)
                prevStatus = val.status; // 할일리스트의 상태를 이전 상태 변수에 저장
                val.status = info.nextStatus; // 인자로 넘겨받은 상태를 할일리스트의 상태 변수에 저장
                this.recordTime(val); // 경과시간 계산 메소드 호출
            });
        console.log(`id: ${info.id}, "${taskName}" 항목이 ${prevStatus} => ${info.nextStatus} 상태로 업데이트 됐습니다.`
        );
        this.showStatus();
    },

    // 업데이트 시 시작시간, 종료시간 기록
    recordTime(todo) { // doing, done 상태 변경시 경과시간을 계산하는 메소드
        if (todo.status === "doing") {
            todo.startTime = new Date('10/3/2018 13:20:40').getTime(); // 시작시간 기록
        }
        if (todo.status === "done") {
            todo.endTime = new Date().getTime(); // 종료시간 기록
            todo.runningTime = this.calRunningTime(todo.startTime, todo.endTime); // 경과시간 기록
        }
    },

    // 기록된 시간을 바탕으로 경과시간 계산(종료시간 - 시작시간)
    calRunningTime(startTime, endTime) {
        let interval = endTime - startTime;
        let days = Math.floor(interval / (1000 * 60 * 60 * 24)); // 경과시간 구하기(일) 
        interval -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(interval / (1000 * 60 * 60)); // 경과시간 구하기(시간)
        interval -= hours * (1000 * 60 * 60);
        let minutes = Math.floor(interval / (1000 * 60)); // 경과시간 구하기(분)
        return `${days != 0 ? `${days}일` : ""} ${hours != 0 ? `${hours} 시간` : ""} ${minutes != 0 ? `${minutes}분` : ""}`;
    },

    // 할 일 삭제 메소드
    removeTodo(removeInfo) {
        const info = removeInfo;
        let taskName;
        this.todoList.forEach((val, idx) => {
            if (val.taskId === info.id) {
                taskName = val.name; // 콘솔 출력을 위해
                this.todoList.splice(idx, 1);
            }
        });
        console.log(`id: ${info.id}, "${taskName}" 삭제완료`);
        this.showStatus();
    },

    // 특정 태그를 기준으로 할일 리스트 생성
    showListByTag(tagName) {
        const listObj = {
            todo: [],
            doing: [],
            done: []
        }
        this.todoList.filter(val => val.tag === tagName)
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
        this.todoList.filter(val => !!val.tag)
            .forEach(val => {
                if (!listObj[val.tag]) {
                    listObj[val.tag] = [val];
                } else if (!!listObj[val.tag]) {
                    listObj[val.tag].push(val);
                }
            });
        this.sortByTaskId(listObj);
        this.printListByAlltheTags(listObj);
    },

    // 생성된 할일 리스트를 아이디 순서로 정렬
    sortByTaskId(listObj) {
        for (let key in listObj) {
            listObj[key].sort((a, b) => a.taskId > b.taskId);
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
        this.todoList.filter(val => val.status === status)
            .sort((a, b) => a.taskId > b.taskId) // id 순으로 정렬
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
        this.todoList.forEach(val => {
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
        setTimeout(() => {
            this.printListBySetTimeout(listObj, "todo");
            console.log(`\n"지금부터 3초뒤에 doing내역을 출력합니다...."`);
            setTimeout(() => {
                this.printListBySetTimeout(listObj, "doing");
                console.log(`\n지금부터 2초뒤에 done내역을 출력합니다...."`);
                setTimeout(() => {
                    this.printListBySetTimeout(listObj, "done");
                }
                    , 2000);
            }
                , 3000);
        }
            , 2000);
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
    }

} // todo end

// 메소드 호출 및 실행 
todo.addTodo({ name: "자바스크립트 공부", tag: "programming" });
todo.addTodo({ name: "알고리즘 문제", tag: "programming" });
todo.addTodo({ name: "스켈레톤 코드 디자인", tag: "programming" });
todo.addTodo({ name: "ajax와 비동기 처리", tag: "programming" });
todo.addTodo({ name: "산책", tag: "hobby" });
todo.addTodo({ name: "헌혈", tag: "hobby" });
todo.addTodo({ name: "사진보정", tag: "hobby" });
todo.addTodo({ name: "사진찍기", tag: "hobby" });
todo.addTodo({ name: "서점들르기", tag: "life" });
todo.addTodo({ name: "맨손운동", tag: "life" });
todo.addTodo({ name: "편의점 생수 1팩 구입", tag: "life" });
todo.addTodo({ name: "친구약속(광화문)", tag: "life" });
todo.addTodo({ name: "현대사 읽기", tag: "study" });


todo.updateTodo({ id: 2, nextStatus: "DoinG" });
todo.updateTodo({ id: 3, nextStatus: "DoinG" });
todo.updateTodo({ id: 5, nextStatus: "DoinG" });
todo.updateTodo({ id: 7, nextStatus: "dOiNg" });
todo.updateTodo({ id: 8, nextStatus: "DoinG" });
todo.updateTodo({ id: 9, nextStatus: "doInG" });
todo.updateTodo({ id: 10, nextStatus: "DoinG" });
todo.updateTodo({ id: 12, nextStatus: "doInG" });


// todo.updateTodo({ id: 3, nextStatus: "DoNe" });
// todo.updateTodo({ id: 5, nextStatus: "dOnE" });
// todo.updateTodo({ id: 7, nextStatus: "done" });
// todo.updateTodo({ id: 9, nextStatus: "donE" });
// todo.updateTodo({ id: 10, nextStatus: "doNE" });
// todo.updateTodo({ id: 12, nextStatus: "DOne" });


// todo.removeTodo({ id: 1 });
// todo.removeTodo({ id: 4 });
// todo.removeTodo({ id: 7 });
// todo.removeTodo({ id: 9 });
// todo.removeTodo({ id: 13 });



