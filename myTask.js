
// 할 일 관리 어플리케이션 step1 modified 1

// 네임 스페이스
const todo = {

    // 할일 목록
    todoList: [],

    // 할 일 id
    taskId: 0,

    // 현재 상태를 보여주는 메소드
    showStatus() {
        const result = {};
        result.todo = 0;
        result.doing = 0;
        result.done = 0;
        this.todoList.forEach(val => {
            if (result[val.status] === 0) {
                result[val.status] = 1;
            } else if (result[val.status] !== 0) {
                result[val.status]++;
            }
        });
        console.log(`현재상태 : todo:${result.todo}개, doing:${result.doing}개, done:${result.done}개`);
    },

    // 할 일 추가 메소드
    addTodo(todoInfo) {
        const info = todoInfo;
        this.taskId++;
        info.taskId = this.taskId;
        info.status = "todo";
        this.todoList.push(info);
        console.log(`id: ${info.taskId}, "${info.name}" 항목이 새로 추가되었습니다.`);
        this.showStatus();
    },

    // 할 일 업데이트 메소드
    updateTodo(updateInfo) {
        const info = updateInfo;
        let prevStatus;
        let taskName;
        info.nextStatus = info.nextStatus.toLowerCase();
        this.todoList.filter(val =>
            val.taskId === info.id).forEach(val => {
                taskName = val.name;
                prevStatus = val.status;
                val.status = info.nextStatus;
            });
        console.log(`id: ${info.id}, "${taskName}" 항목이 ${prevStatus} => ${info.nextStatus} 상태로 업데이트 됐습니다.`);
        this.showStatus();
    },

    // 할 일 삭제 메소드
    removeTodo(removeInfo) {
        const info = removeInfo;
        let taskName;
        this.todoList.forEach((val, idx) => {
            if (val.taskId === info.id) {
                taskName = val.name;
                this.todoList.splice(idx, 1);
            }
        });
        console.log(`id: ${info.id}, "${taskName}" 삭제완료`);
        this.showStatus();
    }
}

// 메소드 호출 및 실행 
todo.addTodo({ name: "자바스크립트 공부하기", tag: "programming" });
todo.addTodo({ name: "알고리즘 문제풀기", tag: "programming" });
todo.addTodo({ name: "사진 보정하기", tag: "hobby" });
todo.updateTodo({ id: 1, nextStatus: "doNe" });
todo.updateTodo({ id: 2, nextStatus: "Doing" });
todo.updateTodo({ id: 3, nextStatus: "doInG" });
todo.removeTodo({ id: 1 });
todo.removeTodo({ id: 2 });
todo.removeTodo({ id: 3 });

