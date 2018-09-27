const todo = {
    list: [],

    add(task){
        task.id = this.list.length + 1;
        task.status = 'todo';
        this.list.push(task);
        this.printResult('add', task);    
    },

    update({id, nextstatus}){
        const targetTask = this.list[id-1];
        const prevStatus = targetTask.status;
        targetTask.status = nextstatus.toLowerCase();
        this.printResult('update', targetTask, prevStatus); 
    },

    remove({id}){
        const targetTask = this.list[id-1];
        this.list[id-1] = undefined;
        this.printResult('remove', targetTask);
    },

    printResult(methodName, task, prevStatus){
        if(methodName === 'add'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 새로 추가됐습니다. 현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        } else if(methodName === 'update'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. 현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        } else {
            console.log(`id: ${task.id},  ${task.name} 삭제완료`);
        }
    },

    countTodoStatus(status){
        const countStatus = this.list.filter(task => !!task && task.status === status).length;
        return countStatus;
    }
};