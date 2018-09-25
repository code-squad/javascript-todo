'use strict'

const todo = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add task addition method
    todoList : [],
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}) {
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.countOfStatus.todo++;

<<<<<<< HEAD
        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const {name: targetTaskName, status: currentStatus} = targetTask;
        
        targetTask.status = newStatus;
        this.countOfStatus[currentStatus]--;
        this.countOfStatus[newStatus]++;

        this.printUpdateResult('update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}) {
        const {name, status} = this.todoList[id-1];
        delete this.todoList[id-1];
        this.countOfStatus[status]--;

        this.printUpdateResult('remove', {taskId: id, taskName: name});
    },
    printUpdateResult(actionType, {taskId, taskName, prevStatus, nextStatus}) {
        const countOfTasksPerStatus = `현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;

        if (actionType === 'add') {
            console.log(`id: ${taskId} "${taskName}" 항목이 새로 추가됐습니다.\n${countOfTasksPerStatus}`);    
            return
        } 
        if (actionType === 'update') {
            console.log(`id: ${taskId} "${taskName}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.\n${countOfTasksPerStatus}`);
            return
        } 
        if (actionType === 'remove') {
            console.log(`id: ${taskId}, "${taskName}" 항목 삭제 완료`);
            return
        }
    }
};

//Test cases
/*
todo.addTask({name: "자바스크립트 공부하기", tag:"programming"});
//> id: 1 "자바스크립트 공부하기" 항목이 새로 추가됐습니다.
//> 현재상태 : todo: 1개, doing: 0개, done: 0개

todo.updateTask({id:1,  nextStatus:"doNe"});
//> id: 1 "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
//> 현재상태 : todo: 0개, doing: 0개, done: 1개

todo.removeTask({id:1});
//> id: 1, "자바스크립트 공부하기" 항목 삭제 완료

console.log(todo.todoList[0], todo.countOfStatus);
=======
    todoList : {},
    addTask({name, tag}) {
        //add todo on todoList
            // assign id#
            const taskId = todoList.keys().length++;
            
        //log completion message
        this.logUpdateResult('add', taskObj);
=======
        this.logUpdateResult('add', {taskId: taskId, taskName: newTaskName});
>>>>>>> Add task addition method
    },
    updateTask({id: taskId, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[taskId-1];
        const {name: taskName, status: prevStatus} = targetTask;
        
        targetTask.status = newStatus;
        this.countOfStatus[prevStatus]--;
        this.countOfStatus[newStatus]++;

        this.logUpdateResult('update', {taskId: taskId, taskName: taskName, prevStatus: prevStatus, nextStatus: newStatus});
    },
    removeTask({id}) {
        this.logUpdateResult('remove', taskObj);
    },
    logUpdateResult(actionType, {taskId, taskName, prevStatus, nextStatus}) {
        let actionResult = ''

        if (actionType === 'add') {
            actionResult = `id: ${taskId} "${taskName}" 항목이 새로 추가됐습니다.\n현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;    
        } else if (actionType === 'update') {
            actionResult = `id: ${taskId} "${taskName}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.\n현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;
        } else if (actionType === 'remove') {
            actionResult = `id: ${task.id}, "${task.name}" 항목 삭제 완료`;
        }
        
        console.log(actionResult);
    }
};

//Test cases
/*
todo.addTask({name: "자바스크립트 공부하기", tag:"programming"});

todo.updateTask({id:1,  nextStatus:"doNe"});

console.log(todo.todoList[0]);
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
>>>>>>> Add initial application template

*/