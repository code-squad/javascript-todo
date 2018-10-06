class Todo {
    constructor(printTodo, errorCheck, log, undoOrRedo){
        this.list = [];
        this.printTodo = printTodo;
        this.errorCheck = errorCheck;
        this.log = log;
        this.undoOrRedo = undoOrRedo; 
    }
    
    add({name, tag}){
        const bError = this.errorCheck.inCaseAdd(this.list, name);
        if(bError) return;
        
        const newTask = {
            id: Date.now().toString(36),
            name: name,
            status: 'todo',
            tag: tag
        }
        
        this.list.push(newTask);
        this.log.pushUndoLog('add', this.log.copyTargetTask(newTask));
        this.printTodo.commandResult(this.list, 'add', newTask);
    }  

    update({id, nextstatus}){
        if(typeof arguments[0] === 'string'){
            [id, nextstatus] = arguments[0].split('$').map(word => word.trim());
        }

        const targetTask = this.list.filter(task => task.id === id)[0];
        const nextStatus = nextstatus.toLowerCase();

        const bError = this.errorCheck.inCaseUpdate(this.list, targetTask, id, nextStatus);
        if(bError) return;

        const prevStatus = targetTask.status;
        const isDoingDone = (prevStatus === 'doing' && nextStatus === 'done'); 

        this.log.pushUndoLog('update', this.log.copyTargetTask(targetTask), nextStatus);
        
        if(nextStatus === 'doing'){
            targetTask.startTime = new Date(Date.now());
        } else if(isDoingDone){
            targetTask.spentTime = Date.now() - targetTask.startTime;
        } else if(targetTask.startTime || targetTask.spentTime){ 
            delete targetTask.startTime;
            delete targetTask.spentTime;
        }

        targetTask.status = nextStatus;

        this.printTodo.commandResult(this.list, 'update', targetTask, prevStatus);    
    }

    remove({id}){
        const bError = this.errorCheck.inCaseRemove(this.list, id);
        if(bError) return;

        const targetIndex = this.list.findIndex(task => task.id === id)
        const targetTask = this.list[targetIndex];

        this.list.splice(targetIndex, 1);
        this.log.pushUndoLog('remove', this.log.copyTargetTask(targetTask)); 
        this.printTodo.commandResult(this.list, 'remove', targetTask);
    }

    showTag(tag){
        this.printTodo.listByTag(this.list, tag);
    }

    showTags(){
        this.printTodo.listByAllTags(this.list);
    }

    show(status){
        this.printTodo.listByStatus(this.list, status);
    }

    showAll(){
        const asynTime = [2000, 3000, 2000];
        this.printTodo.listByAllStatus(this.list, asynTime);
    }

    undo(){
        this.undoOrRedo.undo(this.list);
    }

    redo(){
        this.undoOrRedo.redo(this.list);
    }
}

class PrintTodo{
    constructor(getTodoObj){
        this.getTodoObj = getTodoObj;
    }

    commandResult(todoList, command, task, prevStatus){
        const countTodoStatus = (status) => todoList.filter(task => task.status === status).length;
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
        const todoByTag = this.getTodoObj.tag(todoList, tag);

        Object.keys(todoByTag).forEach(status => {
            if(!todoByTag[status]) return; 
            const resultStr = 
                todoByTag[status].reduce((accStr, task) => {
                    if(task.spentTime) return accStr += `- ${task.id}, ${task.name}, ${this.getTime(task.spentTime)}\n`;
                    return accStr += `- ${task.id}, ${task.name}\n`;
                }, `[ ${status} , 총${todoByTag[status].length}개 ]\n`)
        
            console.log(resultStr + '\n');
        })
    }

    listByAllTags(todoList){
        const todoByTags = this.getTodoObj.tags(todoList);

        Object.keys(todoByTags).forEach(tag => {
            const resultStr = 
                todoByTags[tag].reduce((accStr, task) => {
                    if(task.spentTime) return accStr += `- ${task.id}, ${task.name}, [${task.status}], ${this.getTime(task.spentTime)}\n`;
                    return accStr += `- ${task.id}, ${task.name}, [${task.status}]\n`;
                }, `[ ${tag} , 총${todoByTags[tag].length}개 ]\n`);
            
            console.log(resultStr + '\n');
        });
    }

    listByStatus(list, status){
        let resultStr = '';
        list.filter(task => task.status === status)
            .forEach(task => {
                if(task.spentTime)  resultStr += `- ${task.id}, ${task.name}, [${task.tag}], ${this.getTime(task.spentTime)}\n`;
                else resultStr += `- ${task.id}, ${task.name}${!task.tag ? '' : `, [${task.tag}]\n`}`;                  
        });
        console.log(resultStr);
    }

    listByAllStatus(todoList, asynTime){
        const todoByStatus = this.getTodoObj.status(todoList);
        const kindOfPrint = Object.keys(todoByStatus);
        const countOfCallback = kindOfPrint.length;
        let asynIndex = 0;

        const asynPrint = (status) => {
            asynIndex += 1;
            console.log(`[ ${status} , 총${todoByStatus[status].length}개 ]`)
            if(todoByStatus[status].length) todo.show(status);
            if(kindOfPrint[asynIndex]) console.log(`\n\"지금부터 ${asynTime[asynIndex]/1000}초뒤에 ${kindOfPrint[asynIndex]}내역을 출력합니다....\"`);
            if(asynIndex < countOfCallback) setTimeout(asynPrint, asynTime[asynIndex], kindOfPrint[asynIndex]);
        }
           
        console.log(`\"총 ${todoList.length}개의 리스트를 가져왔습니다. ${asynTime[asynIndex]/1000}초뒤에 ${kindOfPrint[asynIndex]}내역을 출력합니다.....\"`)

        setTimeout(asynPrint, asynTime[asynIndex], kindOfPrint[asynIndex])
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

class GetTodoObj{
    tag(todoList, tag){
        const todoObj = {todo: '', doing: '', done: ''};
        todoList
            .filter(task => task.tag === tag)
            .forEach(task => !todoObj[task.status] ? todoObj[task.status] = [task] : todoObj[task.status].push(task));

        return todoObj;
    }
    
    tags(todoList){
        const todoObj = {};
        todoList
            .filter(task => task.tag)
            .forEach(task => !todoObj[task.tag] ? todoObj[task.tag] = [task] : todoObj[task.tag].push(task));

        return todoObj;
    }

    status(todoList){
        const todoObj = {todo: '', doing: '', done: ''};
        todoList.forEach(task => !todoObj[task.status] ? todoObj[task.status] = [task] : todoObj[task.status].push(task));
        
        return todoObj;
    }
}

class ErrorCheck{
    inCaseAdd(list, name){
        const bSameName = this.isSameTaskName(list, name);
        if(bSameName){
            console.log(`[error] todo에는 이미 같은 이름의 task가 존재합니다.`);
            return true;
        }
        return false;
    }

    inCaseUpdate(list, targetTask, id, status){
        const bSameId = this.isExist(list, id);
        if(!bSameId){
            console.log(`[error] ${id} ID는 존재하지 않습니다.`);
            return true;
        } 
        
        const bSameStatus = targetTask.status !== status;
        if(!bSameStatus){
            console.log(`[error] ${targetTask.id}는 이미 ${status}입니다.`);
            return true;
        }

        const bSameDone = targetTask.status !== 'done';
        if(!bSameDone){
            console.log(`[error] done 상태에서 ${status}상태로 갈 수 없습니다.`);
            return true;
        }
        return false;

    }

    inCaseRemove(list, id){
        const bSameId = this.isExist(list, id);
        if(!bSameId){
            console.log(`[error] ${id} ID는 존재하지 않습니다.`);
            return true;
        }
        return false 
    }

    isSameTaskName(list, name){
        return list.some(task => task.name === name);
    }

    isExist(list, id){
        return list.some(task => task.id === id);
    }
}

class Log{
    constructor(){
        this.undoLog = [];
        this.redoLog = [];
    }

    copyTargetTask(targetTask){
        const copyObj = {};
        for(let key in targetTask){
            if(targetTask.hasOwnProperty(key)){
                copyObj[key] = targetTask[key];
            }
        }
        return copyObj;
    }

    pushUndoLog(methodName, task, nextStatus){
        const log = {
            todoMethod: methodName,
            task: task,
            nextStatus: nextStatus 
        };
        if(this.undoLog.length >= 3) this.undoLog.shift();
        this.undoLog.push(log);
    }

    pushRedoLog(target){
        const log = {
            todoMethod: target.todoMethod,
            task: target.task,
            nextStatus: target.nextStatus 
        };
        if(this.redoLog.length >= 3) this.redoLog.shift();
        this.redoLog.push(log);
    }
}

class UndoOrRedo{
    constructor(log){
        this.log = log;
    }

    undo(list){
        const targetUndo = this.log.undoLog.pop();
        if(!targetUndo) {
            console.log('undo할 todo가 없습니다');
            return;
        }
    
        if(targetUndo.todoMethod === 'add'){
            const undoTaskIndex = list.findIndex(task => task.id === targetUndo.task.id);
            list.splice(undoTaskIndex, 1);
            this.log.pushRedoLog(targetUndo);
            console.log(`\"${targetUndo.task.id}, ${targetUndo.task.name}가 삭제됐습니다\"`);
        } 
        else if(targetUndo.todoMethod === 'update'){
            const undoTaskIndex = list.findIndex(task => task.id === targetUndo.task.id);
            list[undoTaskIndex] = targetUndo.task;
            this.log.pushRedoLog(targetUndo);
            console.log(`\"${targetUndo.task.id}항목이 ${targetUndo.nextStatus} => ${targetUndo.task.status} 상태로 변경됐습니다\"`);
        }
        else if(targetUndo.todoMethod === 'remove'){
            list.push(targetUndo.task);            
            this.log.pushRedoLog(targetUndo);
            console.log(`\"${targetUndo.task.id}항목 \'${targetUndo.task.name}\'가 삭제에서 ${targetUndo.task.status} 상태로 변경됐습니다\"`);
        }
    }

    redo(){
        const targetRedo = this.log.redoLog.pop();
        if(!targetRedo) {
            console.log('redo할 todo가 없습니다');
            return;
        }
    
        if(targetRedo.todoMethod === 'add'){
            todo.add({name: targetRedo.task.name, tag: targetRedo.task.tag});
        }
        else if(targetRedo.todoMethod === 'update'){
            todo.update({id: targetRedo.task.id, nextstatus: targetRedo.nextStatus});
        }
        else if(targetRedo.todoMethod === 'remove'){          
            todo.remove({id: targetRedo.task.id});
        }
    }
}

const errorCheck = new ErrorCheck;
const getTodoObj = new GetTodoObj;
const log = new Log;
const undoOrRedo = new UndoOrRedo(log);
const printTodo = new PrintTodo(getTodoObj);
const todo = new Todo(printTodo, errorCheck, log, undoOrRedo);