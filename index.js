const todo = {
    listObj: {},
    taskId: 0,

    add(task){
        task.id = ++this.taskId;
        task.status = 'todo';
        this.listObj[task.id] = task;
        this.printResult('add', task);    
    },

    update({id, nextstatus}){
        const statusCaseInsensitive = nextstatus.toLowerCase();
        const targetTask = this.listObj[id];
        const prevStatus = targetTask.status;

        if(statusCaseInsensitive === 'doing') targetTask.timeInfo = Date.now();
        if(prevStatus === 'doing' && statusCaseInsensitive === 'done') targetTask.timeInfo = Date.now() - targetTask.timeInfo;

        targetTask.status = statusCaseInsensitive;
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
        const countStatus = Object.values(this.listObj).filter(task => task.status === status).length;
        return countStatus;
    },

    showTag(tag){
        let resultStr = ``;
        const tagObj = Object.values(this.listObj).filter(task => task.tag === tag).reduce((statusObj, task) => {
            statusObj[task.status].push(task);
            return statusObj;
        }, {todo:[], doing: [], done: []});
    
        for(let status in tagObj){
            if(tagObj.hasOwnProperty(status) && tagObj[status].length){
                let tagStr = `[ ${status} , 총${tagObj[status].length}개 ]`;
                tagObj[status].forEach(function(task){
                    tagStr += `\n- ${task.id}번, ${task.name}`;    
                })
                resultStr += tagStr + '\n\n';
            }
        }
        console.log(resultStr);
    },

    showTags(){
        let resultStr = ``;
        const tagObj = Object.values(this.listObj).filter(task => task.tag).reduce((tagObj, task) => {
            if(!tagObj[task.tag]) tagObj[task.tag] = [];
            tagObj[task.tag].push(task);
            return tagObj;
        }, {})

        for(let tag in tagObj){
            if(tagObj.hasOwnProperty(tag)){
                let tagStr = `[ ${tag} , 총${tagObj[tag].length}개 ]`;
                tagObj[tag].forEach(function(task){
                    tagStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`;    
                })
                resultStr += tagStr + '\n\n';
            }
        }
        console.log(resultStr);
    }
}