class Todo {
    constructor(){
        this.list = [];      
    }
    
    add(task){
        task.id = Date.now().toString(36);
        task.status = 'todo';
        this.list.push(task);
        PrintTodo.prototype.commandResult.call(this, 'add', task);
    }  

    update({id, nextstatus}){
        const targetTask = this.list.filter(task => task.id === id)[0];
        const prevStatus = targetTask.status;
        const nextStatus = nextstatus.toLowerCase();
        const isDoingDone = (prevStatus === 'doing' && nextStatus === 'done');    

        if(nextStatus === 'doing') targetTask.startTime = new Date(Date.now());
        else if(isDoingDone) targetTask.spentTime = Date.now() - targetTask.startTime;
        else { 
            delete targetTask.startTime;
            delete targetTask.spentTime;
        }

        targetTask.status = nextStatus;

        PrintTodo.prototype.commandResult.call(this, 'update', targetTask, prevStatus);    
    }

    remove({id}){
        const targetIndex = this.list.findIndex(task => task.id === id)
        const targetTask = this.list[targetIndex];

        this.list.splice(targetIndex, 1); 
        PrintTodo.prototype.commandResult.call(this, 'remove', targetTask);
    }

    showTag(tag){
        PrintTodo.prototype.taskByTag.call(this, tag);
    }

    showTags(){
        PrintTodo.prototype.allTaskByTag.call(this);
    }

    show(status){
        PrintTodo.prototype.taskByStatus.call(this, status);
    }

    showAll(){
        PrintTodo.prototype.allTaskByStatus.call(this);
    }

    getTime(spentTime){
        const days = parseInt(spentTime/24/60/60/1000);
        spentTime -= (days * 24 * 60 * 60 * 1000);
        const hours = parseInt(spentTime/60/60/1000);
        spentTime -= (hours * 60 * 60 * 1000);
        const mins = parseInt(spentTime/60/1000);
        
        let timeStr = ``
        
        if(days) timeStr += `${days}일\n`;
        if(hours) timeStr += `${hours}시간\n`;
        if (mins) timeStr += `${mins}분`;
     
        return timeStr;
    }
}

class PrintTodo{
    commandResult(command, task, prevStatus){
        const countTodoStatus = (status) => this.list.filter(task => task.status === status).length;

        switch(command){
            case 'add':
                console.log(`id: ${task.id}, \"${task.name}\" 항목이 새로 추가됐습니다. \n현재상태 : todo: ${countTodoStatus('todo')}, doing: ${countTodoStatus('doing')}, done: ${countTodoStatus('done')}`);
                break;

            case 'update':
                console.log(`id: ${task.id}, \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. \n현재상태 : todo: ${countTodoStatus('todo')}, doing: ${countTodoStatus('doing')}, done: ${countTodoStatus('done')}`);
                break;

            case 'remove':
                console.log(`id: ${task.id}, ${task.name} 삭제완료`);
                break;

            default:
                console.log('command를 확인하세요.')
        }
    }

    taskByTag(tag){
        let todoByTag = {todo: '', doing: '', done: ''};
        this.list.filter(task => task.tag === tag).forEach(task => {
            if(!todoByTag[task.status]){
                todoByTag[task.status] = [task];
            }else {
                todoByTag[task.status].push(task);
            }
        })

        Object.keys(todoByTag).forEach(status => {
            if(todoByTag[status]){
                console.log(`[ ${status} , 총${todoByTag[status].length}개 ]`);
                todoByTag[status].forEach(task => {
                    if(status !== 'done'){
                        console.log(`- ${task.id}, ${task.name}`);
                    } else {
                        console.log(`- ${task.id}, ${task.name}, ${this.getTime(task.spentTime)}`);
                    }        
                });
                console.log(`\n`);
            }
        })
    }

    allTaskByTag(){
        let todoByTag = {};
        this.list.filter(task => task.tag).forEach(task => {
            if(!todoByTag[task.tag]){
                todoByTag[task.tag] = [task];
            }else {
                todoByTag[task.tag].push(task);
            }
        });

        Object.keys(todoByTag).forEach(tag => {
            console.log(`[ ${tag} , 총${todoByTag[tag].length}개 ]`);
            todoByTag[tag].forEach(task => {
                if(task.status !== 'done'){
                    console.log(`- ${task.id}, ${task.name}, [${task.status}]`);
                } else {
                    console.log(`- ${task.id}, ${task.name}, [${task.status}], ${this.getTime(task.spentTime)}`);
                }        
            });
            console.log(`\n`);
        });
    }

    taskByStatus(status){
        this.list.filter(task => task.status === status).forEach(task => {
            if(status !== 'done'){
                console.log(`- ${task.id}, ${task.name}${!task.tag ? '' : `, [${task.tag}]`}`);
            } else {
                console.log(`- ${task.id}, ${task.name}, [${task.tag}], ${this.getTime(task.spentTime)}`);
            }                       
        });
    }

    allTaskByStatus(){
        const self = this;
        let todoByStatus = {todo: '', doing: '', done: ''};
        this.list.forEach(task => {
            if(!todoByStatus[task.status]){
                todoByStatus[task.status] = [task];
            } else {
                todoByStatus[task.status].push(task);
            }
        });
           
        console.log(`\"총 ${this.list.length}개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다.....\"`)
        setTimeout(function(){
            console.log(`[ todo , 총${todoByStatus['todo'].length}개 ]`)
            self.show('todo');
            console.log(`\n\"지금부터 3초뒤에 doing내역을 출력합니다....\"`);
            setTimeout(function(){
                console.log(`[ doing , 총${todoByStatus['doing'].length}개 ]`)
                self.show('doing');
                console.log(`\n\"지금부터 2초뒤에 done내역을 출력합니다....\"`);
                setTimeout(function(){
                    console.log(`[ done , 총${todoByStatus['done'].length}개 ]`)
                    self.show('done');
                }, 2000)
            }, 3000)
        }, 2000)
    }
}

/*
const todo = new Todo;
todo.add({name: "js 공부하기", tag:"programming"});
todo.add({name: "algorithm 공부하기", tag:"programming"});
todo.add({name: "database 공부하기", tag:"database"});

todo.showTag('programming');
todo.showTags();
todo.show('todo');
todo.showAll();
*/

