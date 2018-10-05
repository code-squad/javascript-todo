class Todo {
    constructor(printTodo){
        this.list = [];
        this.printTodo = printTodo;      
    }
    
    add(task){
        task.id = Date.now().toString(36);
        task.status = 'todo';
        this.list.push(task);
        this.printTodo.commandResult(this.list, 'add', task);
    }  

    update({id, nextstatus}){
        const targetTask = this.list.filter(task => task.id === id)[0];
        const prevStatus = targetTask.status;
        const nextStatus = nextstatus.toLowerCase();
        const isDoingDone = (prevStatus === 'doing' && nextStatus === 'done');    

        if(nextStatus === 'doing') targetTask.startTime = new Date(Date.now());
        else if(isDoingDone) targetTask.spentTime = Date.now() - targetTask.startTime;
        else if(targetTask.startTime || targetTask.spentTime){ 
            delete targetTask.startTime;
            delete targetTask.spentTime;
        }

        targetTask.status = nextStatus;

        this.printTodo.commandResult(this.list, 'update', targetTask, prevStatus);    
    }

    remove({id}){
        const targetIndex = this.list.findIndex(task => task.id === id)
        const targetTask = this.list[targetIndex];

        this.list.splice(targetIndex, 1); 
        this.printTodo.commandResult(this.list, 'remove', targetTask);
    }

    showTag(tag){
        this.printTodo.listByTag(this.list, tag);
    }

    showTags(){
        this.printTodo.allTaskByTags(this.list);
    }

    show(status){
        this.printTodo.taskByStatus(this.list, status);
    }

    showAll(){
        this.printTodo.allTaskByStatus(this.list);
    }
}

class PrintTodo{
    constructor(getTaskObjByProperty){
        this.getTaskObjByProperty = getTaskObjByProperty;
    }

    commandResult(list, command, task, prevStatus){
        const countTodoStatus = (status) => list.filter(task => task.status === status).length;

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

    listByTag(todoList, tag){
        const todoByTag = this.getTaskObjByProperty.tag(todoList, tag);

        Object.keys(todoByTag).forEach(status => {
            if(!todoByTag[status]) return;
            console.log(`[ ${status} , 총${todoByTag[status].length}개 ]`);
            todoByTag[status].forEach(task => {
                if(status !== 'done'){
                    console.log(`- ${task.id}, ${task.name}`);
                } else {
                    console.log(`- ${task.id}, ${task.name}, ${this.getTime(task.spentTime)}`);
                }        
            });
            console.log(`\n`);
        })
    }

    allTaskByTags(list){
        const todoByTags = this.getTaskObjByProperty.tags(list);

        Object.keys(todoByTags).forEach(tag => {
            console.log(`[ ${tag} , 총${todoByTags[tag].length}개 ]`);
            todoByTags[tag].forEach(task => {
                if(task.status !== 'done'){
                    console.log(`- ${task.id}, ${task.name}, [${task.status}]`);
                } else {
                    console.log(`- ${task.id}, ${task.name}, [${task.status}], ${this.getTime(task.spentTime)}`);
                }        
            });
            console.log(`\n`);
        });
    }

    taskByStatus(list, status){
        list.filter(task => task.status === status).forEach(task => {
            if(status !== 'done'){
                console.log(`- ${task.id}, ${task.name}${!task.tag ? '' : `, [${task.tag}]`}`);
            } else {
                console.log(`- ${task.id}, ${task.name}, [${task.tag}], ${this.getTime(task.spentTime)}`);
            }                       
        });
    }

    allTaskByStatus(list){
        const todoByStatus = this.getTaskObjByProperty.status(list);
           
        console.log(`\"총 ${list.length}개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다.....\"`)
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

    getTime(spentTime){
        const days = parseInt(spentTime/24/60/60/1000);
        spentTime -= (days * 24 * 60 * 60 * 1000);
        const hours = parseInt(spentTime/60/60/1000);
        spentTime -= (hours * 60 * 60 * 1000);
        const mins = parseInt(spentTime/60/1000);
        
        let timeStr = ``
        
        if(days) timeStr += `${days}일 `;
        if(hours) timeStr += `${hours}시간 `;
        if (mins) timeStr += `${mins}분`;
     
        return timeStr;
    }
}

class GetTaskObjByProperty{
    tag(list, tag){
        let todoByTag = {todo: '', doing: '', done: ''};
        list.filter(task => task.tag === tag).forEach(task => {
            if(!todoByTag[task.status]){
                todoByTag[task.status] = [task];
            } else {
                todoByTag[task.status].push(task);
            }
        });
        return todoByTag;
    }
    
    tags(list){
        let todoByTags = {};
        list.filter(task => task.tag).forEach(task => {
            if(!todoByTags[task.tag]){
                todoByTags[task.tag] = [task];
            }else {
                todoByTags[task.tag].push(task);
            }
        });
        return todoByTags;
    }

    status(list){
        let todoByStatus = {todo: '', doing: '', done: ''};
        list.forEach(task => {
            if(!todoByStatus[task.status]){
                todoByStatus[task.status] = [task];
            } else {
                todoByStatus[task.status].push(task);
            }
        });
        return todoByStatus;
    }
}

const getTaskObjByProperty = new GetTaskObjByProperty();
const printTodo = new PrintTodo(getTaskObjByProperty);
const todo = new Todo(printTodo);
todo.add({name: "js 공부하기", tag:"programming"});
todo.add({name: "algorithm 공부하기", tag:"programming"});
todo.add({name: "database 공부하기", tag:"database"});

todo.showTag('programming');
todo.showTags();
todo.show('todo');
todo.showAll();

