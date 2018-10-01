const todo = {
    id: {},
    taskId: 0,

    add(task){
        task.id = ++this.taskId;
        task.status = 'todo';
        this.id[task.id] = task;
        this.printResult('add', task);    
    },

    update({id, nextstatus}){
        const caseInsensitiveStatus = nextstatus.toLowerCase();
        const targetTask = this.id[id];
        const prevStatus = targetTask.status;

        if(caseInsensitiveStatus === 'doing') targetTask.timeInfo = new Date(Date.now());
        if(prevStatus === 'doing' && caseInsensitiveStatus === 'done') targetTask.timeInfo = Date.now() - (targetTask.timeInfo).getTime();

        targetTask.status = caseInsensitiveStatus;
        this.printResult('update', targetTask, prevStatus); 
    },

    remove({id}){
        const targetTask = this.id[id];
        delete this.id[id];
        this.printResult('remove', targetTask);
    },

    printResult(methodName, task, prevStatus){
        if(methodName === 'add'){
            console.log(`id: ${task.id}, \"${task.name}\" 항목이 새로 추가됐습니다. 
            현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        }
        if(methodName === 'update'){
            console.log(`id: ${task.id}, \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. 
            현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
        }
        if(methodName === 'remove'){
            console.log(`id: ${task.id}, ${task.name} 삭제완료`);
        }
    },

    countTodoStatus(status){
        const countStatus = Object.values(this.id).filter(task => task.status === status).length;
        return countStatus;
    }
}

const todoPrint = {
    getTodoByStatus(list, status){
        const todoByStatus = Object.values(list).reduce((statusObj, task) => {
            !statusObj[task.status] ? statusObj[task.status] = [task] : statusObj[task.status].push(task);
            return statusObj;
        }, {todo: '', doing: '', done: ''});
        return !status ? todoByStatus : todoByStatus[status];
    },

    getTodoByTag(tag){
        const todoByTag = Object.values(todo.id).reduce((tagObj, task) => {
            if(task.tag) !tagObj[task.tag] ? tagObj[task.tag] = [task] : tagObj[task.tag].push(task);
            return tagObj;
        }, {});
        return !tag ? todoByTag : todoByTag[tag];
    },

    showTag(tag){
        const todoTag = this.getTodoByStatus(this.getTodoByTag(tag));
        let resultStr = ``;

        Object.keys(todoTag).filter(status => todoTag[status].length).forEach(status => {
            if(status === 'done'){
                const tagStr = todoTag[status].reduce((str, task) => str += `\n- ${task.id}번, ${task.name} ${this.getTime(task.timeInfo)}`, `[ ${status} , 총${todoTag[status].length}개 ]`);
                resultStr += tagStr + '\n\n';
            } else {
                const tagStr = todoTag[status].reduce((str, task) => str += `\n- ${task.id}번, ${task.name}`, `[ ${status} , 총${todoTag[status].length}개 ]`);
                resultStr += tagStr + '\n\n';
            }
        })

        console.log(resultStr);
    },

    showTags(){
        const todoTags = this.getTodoByTag();
        let resultStr = ``;

        Object.keys(todoTags).forEach(tag => {
            const tagStr = todoTags[tag].reduce((str, task) => str += `\n- ${task.id}번, ${task.name}, ${task.status}`, `[ ${tag} , 총${todoTags[tag].length}개 ]`);
            resultStr += tagStr + '\n\n';
        });

        console.log(resultStr);
    },

    show(status){
        const resultStr = this.getTodoByStatus(todo.id, status).reduce((statusStr, task) => {
            if(status === 'done' && task.timeInfo) { 
                task.tag ? statusStr += `- ${task.id}번, ${task.name}, [${task.tag}], ${this.getTime(task.timeInfo)}\n` : statusStr += `- ${task.id}번, ${task.name} ${this.getTime(task.timeInfo)}\n`;
            } else {
                task.tag ? statusStr += `- ${task.id}번, ${task.name}, [${task.tag}]\n` : statusStr += `- ${task.id}번, ${task.name}\n`;
            }
            return statusStr;
        }, '');
        console.log(resultStr);
    },

    showAll(){
        const self = this;        
        console.log(`\"총 ${Object.values(todo.id).length}개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다.....\"\n`);
        
        setTimeout(function(){
            console.log(self.show('todo') + '\n\n\"지금부터 3초뒤에 doing내역을 출력합니다.....\"\n');
        }, 2000);
        setTimeout(function(){
            console.log(self.show('doing') + '\n\n\"지금부터 2초뒤에 done내역을 출력합니다.....\"\n');
        }, 5000);
        setTimeout(function(){
           console.log(self.show('done'));
        }, 7000);
    },
    
    getTime(timeInfo){
        const min = 60 * 1000;
        const hour = 60 * min;
        const day = 24 * hour;

        const days = parseInt(timeInfo / day);
        timeInfo -= (days * day);
        const hours = parseInt(timeInfo / hour);
        timeInfo -= (hours * hour);
        const mins = parseInt(Math.floor(timeInfo / min));
        timeInfo -= (mins * min);

        let timeStr = ``

        if(days) timeStr += `${days}일\n`;
        if(hours) timeStr += `${hours}시간\n`;
        if (mins) timeStr += `${mins}분`;

        return timeStr;
    }
}


todo.add({name: "js 공부하기", tag:"programming"});
todo.add({name: "algorithm 공부하기", tag:"programming"});
todo.add({name: "database 공부하기", tag:"database"});
todo.add({name: "ios 공부하기", tag:"programming"});
todo.add({name: "closure 공부하기", tag:"programming"});
todo.add({name: "여행가기", tag:"play"});
todo.add({name: "휴대폰수리", tag:"other"});
todo.add({name: "블로그쓰기", tag:"other"});
todo.add({name: "친구 만나기"});

todo.update({id: 1, nextstatus: 'done'});
todo.update({id: 2, nextstatus: 'done'});
todo.update({id: 3, nextstatus: 'doing'});
todo.update({id: 7, nextstatus: 'done'});
todo.update({id: 5, nextstatus: 'doing'});

todo.remove({id: 4, nextstatus: 'doing'});

todoPrint.showTag('programming');
todoPrint.showTags();
todoPrint.show('todo');
todoPrint.show('doing');
todoPrint.show('done');
todoPrint.showAll();
