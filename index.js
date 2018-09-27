/*
다음처럼 동작하는 할일(task)관리 프로그램을 만듭니다.

새로운 task를 추가할 수 있음
태그(tag)를 옵션으로 추가할 수 있음
모든 task는 id를 가짐
todo/doing/done 상태를 가짐(add시에는 todo)
상태변경을 할 수 있음

코드의 형태는 객체리터럴 형태로 구현한다.

> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
현재상태 :  todo:1개, doing:2개, done:2개

> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
현재상태 :  todo:1개, doing:1개, done:4개  

> todo.remove({id:3});
id:3, iOS공부하기 삭제완료. '
*/

const todo = (function(){
    const todoList = [];
    const status = {todo: 0, doing: 0, done: 0};
    let idStatus = 0;

    return {
        add(task){
            task.id = ++idStatus;
            task.status = todo;
            status.todo++;
            todoList.push(task);
            this.printTodoList(task, this.add);    
        },

        printTodoList(task, func){
            if(func === this.add){
                console.log(`id: ${task.id},  \"${task.name}\" 항목이 새로 추가됐습니다.
            현재상태 : todo: ${status.todo}, doing: ${status.doing}, done: ${status.done}`);
            }
        }
    }
})();