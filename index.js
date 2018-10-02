class Todo {
    constructor(){
        this.list = [];      
    }
    
    add(task){
        task.id = Date.now().toString(36);
        task.status = 'todo';
        this.list.push(task);
        this.printCommandResult('add', task);
    }  

    update({id, nextstatus}){
        const targetTask = this.list.filter(task => task.id === id)[0];
        const prevStatus = targetTask.status;
        const nextStatus = nextstatus.toLowerCase();
        const isDoingDone = (prevStatus === 'doing' && nextStatus === 'done');    

        if(nextStatus === 'doing' || isDoingDone){
            targetTask.timeInfo = new Date(Date.now());
        } else {
            delete targetTask.timeInfo;
        }

        targetTask.status = nextStatus;

        this.printCommandResult('update', targetTask, prevStatus);    
    }

    remove({id}){
        let target;

        this.list.forEach((task, i) => {
            if(task.id === id) target = {task: task, index: i};
        });

        this.list.splice(target.index, 1); 
        this.printCommandResult('remove', target.task);
    }
    
    printCommandResult(command, task, prevStatus){
        switch(command){
            case 'add':
                console.log(`id: ${task.id}, \"${task.name}\" 항목이 새로 추가됐습니다. \n현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
                break;

            case 'update':
                console.log(`id: ${task.id}, \"${task.name}\" 항목이 ${prevStatus} => ${task.status} 상태로 업데이트 됐습니다. \n현재상태 : todo: ${this.countTodoStatus('todo')}, doing: ${this.countTodoStatus('doing')}, done: ${this.countTodoStatus('done')}`);
                break;

            case 'remove':
                console.log(`id: ${task.id}, ${task.name} 삭제완료`);
                break;

            default:
                console.log('command를 확인하세요.')
        }
    }

    countTodoStatus(status){
        const countStatus = this.list.filter(task => task.status === status).length;
        return countStatus;
    }

    show(status){
        if(status !== 'done'){
            this.list.filter(task => task.status === status).forEach(task => {
                console.log(`- ${task.id}, ${task.name}, [${task.tag}]`)
            });
        } else {
            this.list.filter(task => task.status === status).forEach(task => {
                console.log(`- ${task.id}, ${task.name}, [${task.tag}], 시간`)
            });
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