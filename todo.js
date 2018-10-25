class TodosList {
    constructor(error, todoMessage, dataProcessing, log, stopWatch){
        this.todos = [];
        this.id = 1;
        this.error = error;
        this.todoMessage = todoMessage
        this.dataProcessing = dataProcessing;
        this.log = log;
        this.stopWatch = stopWatch;
    }
    add({name, tag, setTime, deadline}, id, errorType){
        let error = this.error.isAddError(this.todos, name, 'name', errorType), lastData;
        if(error){ console.log(error); return; }

        this.todos.push({
            name: name,
            tag: tag,
            id: id || this.id,
            status : 'todo'
        });
        lastData = this.todos.slice(-1).pop();
        if(setTime) this.playAlarm({id: lastData.id, setTime, deadline}, lastData)

        this.manipulateData({active: 'add', id: lastData.id, name: name, tag:lastData.tag}, errorType);
        if(!id){this.id++};
    }
    remove({id, deadline}, errorType){
        let error = this.error.isSameId(this.todos, 'remove', id, errorType);
        if(error){ console.log(error); return; }

        let prevData = this.dataProcessing.getPrevData(this.todos, id);
        this.todos = this.todos.filter((target)=>target.id !== id);

        if(deadline){ console.log(`${id}번 작업의 마감 시간이 지났습니다. 따라서 해당 작업을 삭제합니다.`) }

        this.manipulateData({active: 'remove', id: id, name: prevData.name, tag:prevData.tag, prevStatus: prevData.status}, errorType);
    }
    update({id,  nextStatus, deadline}, errorType){
        if(typeof arguments[0] === 'string'){
            let parseArr = this.dataProcessing.getStringCheck(arguments[0]);
            id = +parseArr[0];
            nextStatus = parseArr[1];
        }
        let prevData = this.dataProcessing.getPrevData(this.todos, id);
            nextStatus = nextStatus.toLowerCase();

        let error = this.error.isUpdateError(prevData, nextStatus, id, errorType) || this.error.isSameId(this.todos, 'update', id, errorType);
        
        if(error){ console.log(error); return; }
        
        this.todos.filter((v)=> v.id === id)
                  .forEach((v)=>{ this.stopWatch.record(nextStatus, v); });
        
        if(errorType === 'alarm') console.log(`${id}번 ${prevData.name} 작업을 시작합니다.`); 
        this.manipulateData({active: 'update', id: id, name: prevData.name, prevStatus: prevData.status, nextStatus}, errorType);
        
        if(deadline) this.playAlarm({id, deadline});
    }
    async playAlarm({id, setTime, deadline}){
        if(setTime){
            await this.todoMessage.delay(setTime);
            this.update({id,  nextStatus: 'doing', deadline}, 'alarm');
        }
        if(deadline){
            await this.todoMessage.delay(deadline);
            this.remove({id, deadline}, 'deadline');
        }
    }
    manipulateData({active, id, name, tag, prevStatus, nextStatus}, errorType){
        let statusCount = this.dataProcessing.getCurrentStatus(this.todos, 'status');
        this.todoMessage.showCurrentStatus(statusCount, {active, id, name, prevStatus, nextStatus}, errorType);
        this.dataProcessing.makeLogObject(this.log, {active, id, name, tag, prevStatus, nextStatus}, errorType);
    }
    showTag(tagName){
        this.processCommonData({classify: 'tag', option: tagName, info: 'status'});
    }
    showTags(){
        this.processCommonData({classify: 'tag', info: 'tag'});
    }
    show(status){
        this.processCommonData({classify: 'status', option: status, info: status});
    }
    showAll(){
        this.processCommonData({classify: 'status', info: 'status', async: 'async'});
    }
    processCommonData({classify, option, info, async}){
        let requiredData = this.dataProcessing.getRequiredData(this.todos, classify, option);
        let printFormat = this.dataProcessing.printFormat(requiredData, info, async);
        if(async === 'async'){
            let asyncData = this.dataProcessing.getAsyncData(printFormat.requiredValueObj, printFormat.countObj);
            this.todoMessage.showAsyncMessage(asyncData);
        } else {
            this.todoMessage.showClassifiedData(printFormat.requiredValueObj, printFormat.countObj);
        }
    }
    undo(){
        let counter = this.log.counter;
        let error = this.error.isProcessingError('undo', counter);
        if(error){ console.log(error); return; }

        let lastData = this.log.list.todos.pop();
        this.executeData(lastData, 'undo');
        this.log.decreaseTodosLogCounter();
    }
    redo(){
        let counter = this.log.counter;
        let error = this.error.isProcessingError('redo', counter);
        if(error){ console.log(error); return; }

        let lastData = this.log.list.undo.pop();
        this.executeData(lastData, 'redo');
        this.log.decreaseUndoLogCounter();
        this.log.decreaseRedoLogCounter();
    }
    executeData(lastData, undo){
        if(lastData.active === 'add') this.remove({id : lastData.id}, undo);
        if(lastData.active === 'remove') this.add({name : lastData.name, tag : lastData.tag}, lastData.id, undo);
        if(lastData.active === 'update') this.update({id : lastData.id, nextStatus : lastData.prevStatus}, undo);
    }
}

class ErrorCheck {
    isAddError(data, name, key, undo){
        let error_check = data.filter((v) => v[key] === name);
        return this.showError({active: 'add', error_check: error_check.pop()}, undo);
    }
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
        return this.showError({active: 'update', error_check, id, prevData, nextStatus}, undo);
    }
    isSameId(data, active, id, errorType){
        let error_check = false;
        let sameId = [];
        if(active === 'remove' || active === 'update'){
            sameId = data.filter((v) => v.id === id).pop();
        }
        if(!sameId){
            error_check = true;
        }
        return this.showError({active: 'remove', error_check: error_check, id: id}, errorType);
    }
    isProcessingError(processingType, counter){
        if(processingType === 'undo'){
            if(counter.undo > 2 ){
                return 'undo는 최대 3회 할 수 있습니다.';
            }
            if(counter.todos === 0){
                return 'undo를 할 수 있는 실행과정이 없습니다.';
            }
        } else if(processingType === 'redo') {
            if(counter.undo === 0){
                return '실행된 undo가 없습니다.';
            }
        }
    }
    showError({active, error_check, id, prevData, nextStatus}, errorType){
        let error = '';
        if(active === 'add' && error_check){
            error = ` todo에는 이미 같은 이름의 task가 존재합니다. `;
        }
        if(active === 'remove' && error_check|| active === 'update' && error_check){
            error = ` ${id} 아이디는 존재하지 않습니다.`;
        }
        if(active === 'update'){
            if(error_check === 'same') error = ` ${id}번은 이미 ${nextStatus}입니다. `;
            if(error_check === 'reverse') error = ` ${prevData.status} 상태에서 ${nextStatus}상태로 갈 수 없습니다.`;
            if(error_check === 'jump') error = ` ${prevData.status}상태에서 바로 ${nextStatus}를 실행할 수 없습니다.`;
        }
        if(error_check && errorType === undefined) error = `[error] ${error}`;
        if(errorType === 'undo' && error_check)  error = `[redoError] ${error}`;
        if(errorType === 'alarm' && error_check) error = `[alarmError] ${error}`;
        if(errorType === 'deadline' && error_check) error = `[deadlineError] ${error}`;
        return error;
    }
}

class TodoMassage {
    showCurrentStatus(statusCount, {active, id, name, prevStatus, nextStatus}, undo){
        (active === 'add') ? console.log(`id: ${id} ${name}항목이 새로 추가되었습니다.`) :
        (active === 'remove' && !undo) ? console.log(`id:${id}, ${name} 삭제완료.`) :
        (active === 'remove' && undo) ? console.log(`${id}번, ${name}가 삭제됐습니다`) :
        (active === 'update') ? console.log(`id:${id}, "${name}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.`) :
        '';
        console.log(`현재상태 :  todo:${statusCount.todo}개, doing:${statusCount.doing}개, done:${statusCount.done}개`);
    }
    showClassifiedData(requiredValueObj, countObj){
        for(let value in requiredValueObj){
            if(value !== 'undefined'){
                console.log(`[ ${value} , 총${countObj[value]}개 ]`);
            }
            console.log(`${requiredValueObj[value]}`);
        }
    }
    async showAsyncMessage(noticeArr){
        for (let x of noticeArr) {
            console.log(x.notice);
            await this.delay(x.sec);
            console.log(x.title);
            console.log(x.list);
        }
    }
    delay(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
}

class DataProcessing {
    getPrevData(data, id){
        let prevData = {
            name: '', 
            id: 0
        };
        data.filter((v) => v.id === id)
            .forEach((v)=> {
                prevData.name = v.name;
                prevData.status = v.status;
                prevData.id = v.id;
                prevData.tag = v.tag;
            })
        
        return prevData;
    }
    getCurrentStatus(data, valueType){
        const countObj =  this.getDefaultData(data, valueType);
        data.forEach((v)=> { ++countObj[v[valueType]]; });
        return countObj;
    }
    getDefaultData(data, valueType){
        let countObj = (valueType === 'status') ? {todo: 0, doing: 0, done: 0} : {};
        data.forEach((target)=> {
            countObj[target[valueType]] = 0;
        });
        return countObj;
    }
    getRequiredData(data, kind, value){
        let requiredData = [];
        let fixedData = (value)? data.filter((v) => v[kind] === value) : data;
        fixedData.forEach((v) => { requiredData.push(v); })
        return requiredData;
    }
    getPrintList(inputData, key ,requiredValueObj){
        inputData.reduce((acc, curr) => {
            requiredValueObj[curr[key]] += 
            `-${curr.id}번, ${curr.name} ${(curr.status === 'done')? curr.elapsedTime+' msec':''} \n`;
            return curr;
        }, requiredValueObj);
        return requiredValueObj;
    }
    printFormat(inputData, key, asyncCheck){
        let countObj = this.getCurrentStatus(inputData, key);
        let requiredValueObj = {};
        for(let value in countObj){
            requiredValueObj[value] = '';
        }
        requiredValueObj = this.getPrintList(inputData, key, requiredValueObj)
        return {countObj, requiredValueObj};
    }
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
        let asyncTime = this.getAsyncTime(noticeArr);
        return this.getAsyncNotice(asyncTime, numOfData);
    }
    getCounter(countObj){
        let numOfData = 0;
        for(let value in countObj){
            numOfData += +countObj[value];
        }
        return numOfData;
    }
    makeLogObject(logObj, {active, id, name, tag, prevStatus, nextStatus}, undo){
        if(undo === 'undo'){
            logObj.undoLogList({ active, id, name, tag, prevStatus, nextStatus, });
        } else {
            logObj.makeLogList({ active, id, name, tag, prevStatus, nextStatus, });
        }
    }
    getStringCheck(arg){
        if(typeof(arg) === 'string'){
            let str = arg;
            arg = str.replace(/\s/g,'')
                         .split("$");
        }
        return arg;
    }
    getAsyncTime(noticeArr){
        const valueAsyncTime = {
            todo: 2000,
            doing: 3000,
            done: 2000
        }
        for(let obj of noticeArr){
            obj.sec =   valueAsyncTime[obj.value];
        }
        return noticeArr;
    }
    getAsyncNotice(noticeArr, numOfData){
        for(let obj of noticeArr){
            if(obj.value === 'todo')  obj.notice = `총 ${numOfData}개의 리스트를 가져왔습니다. ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다.....`;
            if(obj.value === 'doing') obj.notice = `지금부터 ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다....`;
            if(obj.value === 'done')  obj.notice = `지금부터 ${obj.sec/1000}초뒤에 ${obj.value}내역을 출력합니다.....`;
        }
        return noticeArr;
    }
}

class Log {
    constructor(){
        this.counter = {
            todos: 0,
            undo: 0,
            redo: 0
        }
        this.list = {
            todos: [],
            undo: []
        }
    }
    
    makeLogList({active, id, name, tag,status, prevStatus, nextStatus}){
        this.list.todos.push({ active, id, name, status, tag, prevStatus, nextStatus })
        this.counter.todos++;
    }
    undoLogList({active, id, name, tag,status, prevStatus, nextStatus}){
        this.list.undo.push({ active, id, name, status, tag, prevStatus, nextStatus })
        this.counter.undo++;
        this.counter.redo++;
    }
    decreaseTodosLogCounter(){
        this.counter.todos--;
    }
    decreaseUndoLogCounter(){
        this.counter.undo--;
    }
    decreaseRedoLogCounter(){
        this.counter.redo--;
    }
}

class StopWatch {
    start(){
        return new Date().getTime();
    }
    stop(start){
        return new Date().getTime() - start;
    }
    record(nextStatus, value){
        if(nextStatus === 'doing'){ value.startTime = this.start(); }
        if(nextStatus === 'done' && value.startTime){ value.elapsedTime = this.stop(value.startTime); }
        value.status = nextStatus;
    }
}

const todosList = new TodosList(new ErrorCheck(), new TodoMassage, new DataProcessing(), new Log(), new StopWatch());

// undo &b redo test
console.log("- undo, redo 기본 사용");
console.log();
todosList.add({name: "자바스크립트 공부하기", tag:"programming", setTime: 10000, deadline: 1000});
todosList.undo();
todosList.redo();
console.log();
console.log("- 1회 이상 사용시");
console.log();
todosList.add({name: "ios 공부하기", tag:"programming", setTime: 12000});
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
todosList.add({name: "알고리즘 공부하기", tag:"programming", setTime: 13000});
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
todosList.update({id:4,  nextStatus:"doing", deadline: 15000});

console.log();
console.log("- tag에 따른 결과값");
console.log();
todosList.showTag("programming");
console.log();
console.log("- 모든 data tag에 따라 출력");
console.log();
todosList.showTags();
console.log();
console.log("- status 상태에 따른 리스트 출력");
console.log();
todosList.show('done');
console.log();
console.log("- 타입별 데이터 출력");
console.log();

todosList.showTag("programming");
todosList.showTags();
todosList.show('todo');
todosList.showAll();