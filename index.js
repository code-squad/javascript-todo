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

const todo = {
    list: [],

    add(task){
        task.id = this.list.length + 1;
        task.status = 'todo';
        this.list.push(task);
        this.printTodoList('add', task);    
    },

    update({id, nextstatus}){
        const mappedTask = this.list[id-1];
        const prevStatus = mappedTask.status;
        mappedTask.status = nextstatus.toLowerCase();
        this.printTodoList('update', mappedTask, prevStatus); 
    },

    printTodoList(methodName, task, prevStatus){
        if(methodName === 'add'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 새로 추가됐습니다. 현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        } else if(methodName === 'update'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. 현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        }
    },

    countTodoStatus(status){
        const listOfStatus = this.list.filter(task => task.status === status);
        return listOfStatus.length;
    }
};