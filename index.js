const todo = {
    listObj: {},
    taskId: 0,

    add(task){
        task.id = ++this.taskId;
        task.status = 'todo';
        this.listObj[task.id] = task
        this.printResult('add', task);    
    },

    update({id, nextstatus}){
        const targetTask = this.listObj[id];
        const prevStatus = targetTask.status;

        targetTask.status = nextstatus.toLowerCase();
        this.printResult('update', targetTask, prevStatus); 
    },

    remove({id}){
        const targetTask = this.listObj[id];

        delete this.listObj[id];
        this.printResult('remove', targetTask);
    },

    printResult(methodName, task, prevStatus){
        if(methodName === 'add'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 새로 추가됐습니다. \n현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        }
        if(methodName === 'update'){
            console.log(`id: ${task.id},  \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. \n현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        }
        if(methodName === 'remove'){
            console.log(`id: ${task.id},  ${task.name} 삭제완료`);
        }
    },

    countTodoStatus(status){
        let countStatus = 0;
        for(let id in this.listObj){
            if(this.listObj.hasOwnProperty(id) && this.listObj[id].status === status) countStatus++;
        }
        return countStatus;
    }
};