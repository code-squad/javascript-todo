'use strict'

const todo = {
    todoList : {},
    addTask({name, tag}) {
        //add todo on todoList
            // assign id#
            const taskId = todoList.keys().length++;
            
        //log completion message
        this.logUpdateResult('add', taskObj);
    },
    updateTask({id, nextstatus}) { // change status of task 
        const nextStatus = nextstatus.toLowerCase();
        this.logUpdateResult('update', taskObj);
    },
    removeTask({id}) {
        this.logUpdateResult('remove', taskObj);
    }
    logUpdateResult(actionType, taskObj) {
        let actionResult = ''

        if (actionType === 'add') {
            actionResult = `id: ${task.id} "${task.name}" 항목이 새로 추가됐습니다.\n현재상태 : todo: ${}개, doing: ${}개, done: ${}개`;    
        }
        if (actionType === 'update') {
            actionResult = `id: ${task.id} "${task.name}" 항목이 ${} => ${} 상태로 업데이트 됐습니다.\n현재상태 : todo: ${}개, doing: ${}개, done: ${}개`;
        }
        if (actionType === 'remove') {
            actionResult = `id: ${task.id}, "${task.name}" 항목 삭제 완료`;
        }
        
        console.log(actionResult);
    }

    
};
/*
const exampleTask = {
    tag: null,
    status: 'todo', //it can be one of following: todo / doing / done

}

/*
[요구사항]
새로운 task를 추가할 수 있음
태그(tag)를 옵션으로 추가할 수 있음
모든 task는 id를 가짐
todo/doing/done 상태를 가짐(add시에는 todo)
상태변경을 할 수 있음
code 구현형태

코드의 형태는 객체리터럴 형태로 구현한다.

[동작형태]

> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
현재상태 :  todo:1개, doing:2개, done:2개

> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
현재상태 :  todo:1개, doing:1개, done:4개  

> todo.remove({id:3});
id:3, iOS공부하기 삭제완료. '

*/