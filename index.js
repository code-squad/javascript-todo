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
        const caseInsensitiveStatus = nextstatus.toLowerCase();
        const targetTask = this.listObj[id];
        const prevStatus = targetTask.status;

        if(caseInsensitiveStatus === 'doing') targetTask.timeInfo = Date.now();
        if(prevStatus === 'doing' && caseInsensitiveStatus === 'done') targetTask.timeInfo = Date.now() - targetTask.timeInfo;

        targetTask.status = caseInsensitiveStatus;
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
    }
}

const todoPrint = {
    showTag(tag){
        let resultStr = ``;
        const tagObj = Object.values(todo.listObj).filter(task => task.tag === tag).reduce((statusObj, task) => {
            statusObj[task.status].push(task);
            return statusObj;
        }, {todo:[], doing: [], done: []});
    
        for(let status in tagObj){
            if(tagObj.hasOwnProperty(status) && tagObj[status].length){
                let tagStr = `[ ${status} , 총${tagObj[status].length}개 ]`;
                tagObj[status].forEach(task => tagStr += `\n- ${task.id}번, ${task.name}`);
                resultStr += tagStr + '\n\n';
            }
        }
        console.log(resultStr);
    },

    showTags(){
        let resultStr = ``;
        const tagObj = Object.values(todo.listObj).filter(task => task.tag).reduce((tagObj, task) => {
            !tagObj[task.tag] ? tagObj[task.tag] = [task] : tagObj[task.tag].push(task);
            return tagObj;
        }, {})

        for(let tag in tagObj){
            if(tagObj.hasOwnProperty(tag)){
                let tagStr = `[ ${tag} , 총${tagObj[tag].length}개 ]`;
                tagObj[tag].forEach(task => tagStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`);
                resultStr += tagStr + '\n\n';
            }
        }
        console.log(resultStr);
    },

    show(status){
        const resultStr = Object.values(todo.listObj).filter(task => task.status === status).reduce((statusStr, task) => {
            task.tag ? statusStr += `- ${task.id}번, ${task.name}, [${task.tag}]\n` : statusStr += `- ${task.id}번, ${task.name}\n`;
            return statusStr;
        }, '');
        console.log(resultStr);
    },

    showAll(){
        const todoObj = Object.values(todo.listObj).reduce((statusObj, task) => {
            statusObj[task.status].push(task);
            return statusObj;
        }, {todo:[], doing: [], done: []});

        function makeStatusStr(status){
            let tagStr = `[ ${status} , 총${todoObj[status].length}개 ]`;
            todoObj[status].forEach(task => tagStr += `\n- ${task.id}번, ${task.name}, [${task.tag}]`);
            return tagStr;
        }

        var asyncPrint = new Promise(function(resolve, reject){
            resolve(makeStatusStr);
        });

        asyncPrint.then(function(value){
            console.log(`\"총 ${Object.values(todo.listObj).length}개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다.....\"\n`);
            setTimeout(function(){
                console.log(value('todo') + '\n\n\"지금부터 3초뒤에 doing내역을 출력합니다.....\"\n');
            }, 2000);
            return makeStatusStr;
        }).then(function(value){
            setTimeout(function(){
                console.log(value('doing') + '\n\n\"지금부터 2초뒤에 done내역을 출력합니다.....\"\n');
            }, 5000);
            return makeStatusStr;
        }).then(function(value){
            setTimeout(function(){
                console.log(value('done'));
            }, 7000);
        })
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

todoPrint.showAll();
