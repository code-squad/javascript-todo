const todosList = {
    todos : [],
    id : 1,
    add({name, tag}, id, undo){
        let error = errorCheck.isAddError(name, 'name', undo), lastData;
        if(error){ console.log(error); return;}
        this.todos.push({
            name: name,
            tag: tag,
            id: id || this.id,
            status : 'todo'
        });

        lastData = this.todos.slice(-1).pop();
        todoMessage.showActiveMessage(['add', lastData.id, name]);
        
        (undo === 'undo')?
        getData.getLogObject(['add', lastData.id, , lastData.tag, , ], 'undo'): 
        getData.getLogObject(['add', lastData.id, , lastData.tag, , ]);
        
        if(!id){this.id++};
    },
    remove({id}, undo){
        let prevData = getData.getPrevData(id),
            error = errorCheck.isSameId('remove', id, undo);
        if(error){ console.log(error); return; }

        this.todos = this.todos.filter((target)=>target.id !== id);

        todoMessage.showActiveMessage(['remove' ,id , prevData.name, prevData.status], undo);
        (undo === 'undo')?
        getData.getLogObject(['remove', id, prevData.name, prevData.tag, , ], 'undo'):
        getData.getLogObject(['remove', id, prevData.name, prevData.tag, , ]);
    },
    update({id,  nextStatus}, undo){
        if(typeof(Object.values(arguments)[0]) === 'string'){
            parseArr = getData.getStringCheck(arguments);
            id = +parseArr[0]; nextStatus = parseArr[1];
        }
        let prevData = getData.getPrevData(id),
            error = errorCheck.isUpdateError(prevData, nextStatus, id, undo) || errorCheck.isSameId('update', id, undo);
            nextStatus = nextStatus.toLowerCase();
        
        if(error){ console.log(error); return; }

        this.todos.filter((v)=> v.id === id)
                  .forEach((v)=>{
                    if(nextStatus === 'doing'){ v.startTime = stopWatch.start(); }
                    if(nextStatus === 'done' && v.startTime){ v.elapsedTime = stopWatch.stop(v.startTime); }
                    v.status = nextStatus;      
                  });

        todoMessage.showActiveMessage(['update' ,id ,prevData.name, prevData.status, nextStatus]);
        
        (undo === 'undo')?
        getData.getLogObject(['update', id, prevData.name, prevData.tag, prevData.status, nextStatus], 'undo'):
        getData.getLogObject(['update', id, prevData.name, prevData.tag, prevData.status, nextStatus]);
    },
    showTag(tagName){
        let requiredData = getData.getRequiredData(this.todos, 'tag', tagName);
        getData.getPrintFormat(requiredData, 'status');
    },
    showTags(){
        let requiredData = getData.getRequiredData(this.todos, 'tag');
        getData.getPrintFormat(requiredData, 'tag');
    },
    show(status){
        let requiredData = getData.getRequiredData(this.todos, 'status', status);
        getData.getPrintFormat(requiredData, status);
    },
    showAll(){
        let requiredData = getData.getRequiredData(this.todos, 'status');
        getData.getPrintFormat(requiredData, 'status', 'async');
    },
    undo(){
        let error = errorCheck.getProcessingError('undo');
        if(!!error){ console.log(error); return; }
        
        let lastData = log.todosLog.pop();
        getData.getProcessingData(lastData, 'undo');
        log.decreaseTodosLogCounter();
    },
    redo(){
        let error = errorCheck.getProcessingError('redo');
        if(!!error){ console.log(error); return; }

        let lastData = log.undoLog.pop();
        getData.getProcessingData(lastData, 'redo');
        log.decreaseUndoLogCounter();
        log.decreaseRedoLogCounter();
    },  
    
};

const errorCheck = {
    isAddError(name, key, undo){
        let error_check = [];
        error_check = todosList.todos.filter((v) => v[key] === name);
        return this.getErrorMessage(['add', error_check.pop()], undo);
    },
    isUpdateError(prevData, nextStatus, id, undo){
        let error_check;
        if(prevData.status === nextStatus){
            error_check = 'same';
        }
        if(prevData.status === 'done' && nextStatus === 'doing'){
            error_check = 'reverse';
        }
        if(prevData.status === 'todo' && nextStatus === 'done'){
            error_check = 'jump';
        }
        return this.getErrorMessage(['update', error_check, id, prevData, nextStatus], undo);
    },
    isSameId(active, id, undo){
        let error_check = false;
        let sameId = [];
        if(active === 'remove' || active === 'update'){
            sameId = todosList.todos.filter((v) => v.id === id).pop();
        }
        if(!sameId){
            error_check = true;
        }
        return this.getErrorMessage(['remove', error_check, id], undo);
    },
    getProcessingError(processingType){
        if(processingType === 'undo'){
            if(log.undoCounter > 2 ){
                return 'undo는 최대 3회 할 수 있습니다.';
            }
            if(log.todosCounter === 0){
                return 'undo를 할 수 있는 실행과정이 없습니다.';
            }
        } else if(processingType === 'redo') {
            if(log.undoCounter === 0){
                return '실행된 undo가 없습니다.';
            }
        }
    },
    getErrorMessage([active, error_check, id, prevData, nextStatus], undo){

        let error = '';
        if(active === 'add' && error_check){ 
            error = `${(!!undo)? '[redoError]': '[error]'} todo에는 이미 같은 이름의 task가 존재합니다. `;
        }
        if(active === 'remove' && error_check|| active === 'update' && error_check){
            error = `${(!!undo)? '[redoError]': '[error]'} ${id} 아이디는 존재하지 않습니다.`;
        }
        if(active === 'update'){
            error = (error_check === 'same')? `${(!!undo)? '[redoError]': '[error]'} ${id}번은 이미 ${nextStatus}입니다. `:
                    (error_check === 'reverse')? `${(!!undo)? '[redoError]': '[error]'} ${prevData.status} 상태에서 ${nextStatus}상태로 갈 수 없습니다.`:
                    (error_check === 'jump')? `${(!!undo)? '[redoError]': '[error]'} ${prevData.status}상태에서 바로 ${nextStatus}를 실행할 수 없습니다.`:'';
        }
        return error;
    },
}

const todoMessage = {
    showActiveMessage([activeType, id, name, status,update_status], undo){
        (activeType === 'add') ? console.log(`id: ${id} ${name}항목이 새로 추가되었습니다.`) :
        (activeType === 'remove' && !undo) ? console.log(`id:${id}, ${name} 삭제완료.`) :
        (activeType === 'remove' && undo) ? console.log(`${id}번, ${name}가 삭제됐습니다`) :
        (activeType === 'update') ? console.log(`id:${id}, "${name}" 항목이 ${status} => ${update_status} 상태로 업데이트 됐습니다.`) :
        '';
        let statusCount = getData.getCurrentStatus(todosList.todos, 'status');
        console.log(`현재상태 :  todo:${statusCount.todo}개, doing:${statusCount.doing}개, done:${statusCount.done}개`);
    },
    showMessage(requiredValueObj, countObj){
        for(let value in requiredValueObj){
            if(value !== 'undefined'){
                console.log(`[ ${value} , 총${countObj[value]}개 ]`);
            }
            console.log(`${requiredValueObj[value]}`);
        }
    },
    showAsyncMessage(noticeArr, index=0){
        (function playLoop() {
            if(index > 2) return;
            console.log(noticeArr[index].notice);
            setTimeout(function() {
                console.log(noticeArr[index].title);
                console.log(noticeArr[index].list);
                index++; 
                playLoop();
            }, noticeArr[index].sec);    
        })();
    },
}

const getData = {
    getPrevData(id){
        let prevData = {
            name: '', 
            id: 0
        };
       todosList.todos
                .filter((v) => v.id === id)
                .forEach((v)=> {
                    prevData.name = v.name;
                    prevData.status = v.status;
                    prevData.id = v.id;
                    prevData.tag = v.tag;
                })
        
        return prevData;
    },
    getCurrentStatus(data, valueType){
        const countObj =  getData.getDefaultData(todosList.todos, valueType);
        data.forEach((v)=> {
            ++countObj[v[valueType]];
        });
        return countObj;
    },
    getDefaultData(todosList, valueType){
        let countObj = (valueType === 'status') ? {todo: 0, doing: 0, done: 0} : {};
        todosList.forEach((target)=> {
            countObj[target[valueType]] = 0;
        });
        return countObj;
    },
    getRequiredData(data, kind, value){
        let requiredData = [];
        let fixedData = (value)? data.filter((v) => v[kind] === value) : data;
        fixedData.forEach((v) => { requiredData.push(v); })
        return requiredData;
    },
    getPrintList(inputData, key ,requiredValueObj){
        inputData.reduce((acc, curr) => {
            requiredValueObj[curr[key]] += 
            `-${curr.id}번, ${curr.name} ${(curr.status === 'done')? curr.elapsedTime+' msec':''} \n`;
            return curr;
        }, requiredValueObj);
        return requiredValueObj;
    },
    getPrintFormat(inputData, key, asyncCheck){
        let countObj = this.getCurrentStatus(inputData, key);
        let requiredValueObj = {};
        for(let value in countObj){
            requiredValueObj[value] = '';
        }
        requiredValueObj = this.getPrintList(inputData, key, requiredValueObj)
        if(asyncCheck) {this.getAsyncData(requiredValueObj, countObj, inputData)}
        else { todoMessage.showMessage(requiredValueObj, countObj) };
    },
    getAsyncData(requiredValueObj, countObj){
        let numOfData = this.getCounter(countObj);
        let noticeArr = []
        for(let value in requiredValueObj){
            noticeArr.push({
                value,
                title : `[ ${value} , 총${countObj[value]}개 ]`,
                list  : `${requiredValueObj[value]}`,
            })
        }
        this.getAsyncTime(noticeArr, numOfData);
    },
    getCounter(countObj){
        let numOfData = 0;
        for(let value in countObj){
            numOfData += +countObj[value];
        }
        return numOfData;
    },
    getAsyncTime(noticeArr, numOfData){
        const valueAsyncTime = {
            todo: 2000,
            doing: 3000,
            done: 2000
        }
        for(let obj of noticeArr){
            obj.sec =   valueAsyncTime[obj.value];
        }
        this.getAsyncNotice(noticeArr, numOfData)
    },
    getAsyncNotice(noticeArr, numOfData){
        for(let obj of noticeArr){
            obj.notice =   (obj.value === 'todo') ? `총 ${numOfData}개의 리스트를 가져왔습니다. ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다.....`:
                           (obj.value === 'doing')? `지금부터 ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다....`:
                           (obj.value === 'done') ? `지금부터 ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다.....`: '';
        }
        todoMessage.showAsyncMessage(noticeArr);
    },
    getLogObject([active, id, name, tag, prevStatus, nextStatus], undo){
        if(undo === 'undo'){
            log.undoLogList({
                active, id, name, tag, prevStatus, nextStatus,
            });
        } else {
            log.makeLogList({
                active, id, name, tag, prevStatus, nextStatus,
            });
        }
    },
    getProcessingData(lastData, undo){
        (lastData.active === 'add')   ?
            todosList.remove({id : lastData.id}, undo):
        (lastData.active === 'remove')?
            todosList.add({name : lastData.name, tag : lastData.tag}, lastData.id, undo):
        (lastData.active === 'update')?
            todosList.update({id : lastData.id, nextStatus : lastData.prevStatus}, undo): '';
    },
    getStringCheck(arg){
        if(typeof(Object.values(arg)[0]) === 'string'){
            let str = Object.values(arg)[0];
                arr = str.replace(/\s/g,'')
                         .split("$");
        }
        return arr;
    }
}

const log  = {
    todosCounter : 0,
    undoCounter : 0,
    redoCounter : 0,
    todosLog : [],
    undoLog  : [],
    makeLogList({active, id, name, tag,status, prevStatus, nextStatus}){
        this.todosLog.push({
            active, id, name, status, tag, prevStatus, nextStatus
        })
        this.todosCounter++;
    },
    undoLogList({active, id, name, tag,status, prevStatus, nextStatus}){
        this.undoLog.push({
            active, id, name, status, tag, prevStatus, nextStatus
        })
        this.undoCounter++;
        this.redoCounter++;
    },
    decreaseTodosLogCounter(){
        this.todosCounter--;
    },
    increaseUndoLogCounter(){
        this.undoCounter++;
    },
    decreaseUndoLogCounter(){
        this.undoCounter--;
    },
    decreaseRedoLogCounter(){
        this.redoCounter--;
    },
}

const stopWatch = {
    start(){
        return new Date().getTime();
    },
    stop(start){
        return new Date().getTime() - start;
    }
}


// undo &b redo test
console.log("- undo, redo 기본 사용");
console.log();
todosList.add({name: "자바스크립트 공부하기", tag:"programming"});
todosList.undo();
todosList.redo();
console.log();
console.log("- 1회 이상 사용시");
console.log();
todosList.add({name: "ios 공부하기", tag:"programming"});
todosList.undo();
todosList.redo();
todosList.undo();
todosList.redo();
console.log();
console.log("- update 파라미터로 문자열을 넣었을 시");
console.log();
todosList.update("2$doing");

console.log();
console.log("- 3회 이상 사용시 오류& undo을 실행하지 않고 redo 실행시 오류");
console.log();
todosList.add({name: "알고리즘 공부하기", tag:"programming"});
todosList.undo();
todosList.undo();
todosList.undo();
todosList.undo();
todosList.redo();
todosList.redo();
todosList.redo();
todosList.redo();
console.log();
console.log("- undo의 데이터 변경으로 인한 redo 실행오류: [undoError]를 오류 메세지 앞에 붙여 명시적으로 redo 오류임을 나타냄.");
console.log();
todosList.update({id:1,  nextStatus:"doing"});
todosList.undo();
todosList.remove({id:1});
todosList.redo();
console.log();
console.log();
todosList.add({name: "영어 공부하기", tag:"study"});
todosList.add({name: "점심 먹기", tag:"eat"});
todosList.add({name: "영어 공부하기", tag:"study"});
todosList.add({name: "저녁 먹기", tag:"eat"});
console.log();
console.log();
todosList.update({id:2,  nextStatus:"doing"});
todosList.undo();
todosList.redo();
todosList.update({id:2,  nextStatus:"done"});
todosList.update({id:4,  nextStatus:"doing"});

console.log();
console.log("- tag에 따른 결과값");
console.log();
todosList.showTag("study");
console.log();
console.log("- 모든 data tag에 따라 출력");
console.log();
todosList.showTags();
console.log();
console.log("- status 상태에 따른 리스트 출력");
console.log();
todosList.show('done');
console.log();
console.log("- 데이터 비동기 출력");
console.log();

// todosList.showTag("programming");
// todosList.showTags();
// todosList.show('todo');
todosList.showAll();