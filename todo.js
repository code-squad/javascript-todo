const todosList = {
    todos : [],
    id : 1,
    add({name, tag}){
        this.todos.push({
            name: name,
            tag: tag,
            id: this.id,
            status : 'todo'
        });
        todoMessage.showActiveMessage(['add', this.id, name]);
        this.id++;
    },
    remove({id}){
        let prev_data = getData.getPrevData('remove', id);
        this.todos = this.todos.filter((target)=>target.id !== id);
        todoMessage.showActiveMessage(prev_data);
    },
    update({id,  nextstatus}){
        nextstatus = nextstatus.toLowerCase();
        let prev_data = getData.getPrevData('update', id);
        for(let o of this.todos){
            if(o.id === id) {
                if(nextstatus === 'doing'){ o.startTime = stopWatch.start(); }
                if(nextstatus === 'done' && o.startTime){ o.elapsedTime = stopWatch.stop(o.startTime); }
                if(nextstatus === 'done' && !o.startTime){ console.log("해당 작업 완료 후 done을 입력할 수 있습니다. doing을 먼저 입력해주세요."); }
                else {o.status = nextstatus;}
            }
        };
        todoMessage.showActiveMessage(prev_data, nextstatus);
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
};

const todoMessage = {
    showActiveMessage([activeType, id, name, status], update_status){
        (activeType === 'add') ? console.log(`id: ${id} ${name}항목이 새로 추가되었습니다.`) :
        (activeType === 'remove') ? console.log(`id:${id}, ${name} 삭제완료.`) :
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
    getPrevData(funcName, id){
        let prev_data = {
            prevName: '', 
            idx: 0
        };
        for(let o of todosList.todos){
            if(o.id === id){
                prev_data.prevName = o.name;
                prev_data.prevStatus = o.status;
                prev_data.idx = o.id;
            }
        };
        return [funcName ,id ,prev_data.prevName, prev_data.prevStatus];
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
        fixedData.forEach((v) => {
            requiredData.push(v);
        })
        return requiredData;
    },
    getPrintFormat(inputData, key, asyncCheck){
        let countObj = this.getCurrentStatus(inputData, key);
        let requiredValueObj = {};
        for(let value in countObj){
            requiredValueObj[value] = '';
        }
        inputData.reduce((acc, curr,i) => {
            requiredValueObj[curr[key]] += 
            `-${curr.id}번, ${curr.name} ${(curr.status === 'done')? curr.elapsedTime+' msec':''} \n`;
            return curr;
        }, requiredValueObj);
        if(asyncCheck){this.showAsyncData(requiredValueObj, countObj, inputData)}
        else{todoMessage.showMessage(requiredValueObj, countObj)}
    },
    showAsyncData(requiredValueObj, countObj){
        let noticeArr = []
        for(let value in requiredValueObj){
            noticeArr.push({
                value,
                title : `[ ${value} , 총${countObj[value]}개 ]`,
                list  : `${requiredValueObj[value]}`,
            })
        }
        this.getAsyncCounter(noticeArr, countObj);
    },
    getAsyncCounter(noticeArr, countObj){
        let numOfData = 0;
        for(let value in countObj){
            numOfData += +countObj[value];
        }
        this.getAsyncTime(noticeArr, numOfData);
    },
    getAsyncTime(noticeArr, numOfData){
        for(let obj of noticeArr){
            obj.sec =   (obj.value === 'todo') ? 2000:
                        (obj.value === 'doing')? 3000:
                        (obj.value === 'done') ? 2000: 0;
        }
        this.getAsyncNotice(noticeArr, numOfData)
    },
    getAsyncNotice(noticeArr, numOfData){
        for(let obj of noticeArr){
            obj.notice =   (obj.value === 'todo') ? `총 ${numOfData}개의 리스트를 가져왔습니다. 2초뒤에 ${obj.value}내역을 출력합니다.....`:
                           (obj.value === 'doing')? `지금부터 3초뒤에 ${obj.value}내역을 출력합니다....`:
                           (obj.value === 'done') ? `지금부터 2초뒤에 ${obj.value}내역을 출력합니다.....`: '';
        }
        todoMessage.showAsyncMessage(noticeArr)
    }
}

const stopWatch = {
    start(){
        return new Date().getTime();
    },
    stop(start){
        return new Date().getTime() - start;
    }
}

todosList.add({name: "자바스크립트 공부하기", tag:"study"});
todosList.add({name: "자료구조 공부하기", tag:"programming"});
todosList.update({id:1,  nextstatus:"done"});
todosList.update({id:1,  nextstatus:"doing"});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.update({id:1,  nextstatus:"done"});
todosList.remove({id:1});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.update({id:3,  nextstatus:"doing"});
todosList.update({id:4,  nextstatus:"done"});
todosList.add({name: "여행가기", tag:"play"});
todosList.add({name: "OS", tag:"programming"});
todosList.update({id:3,  nextstatus:"done"});
todosList.add({name: "ios", tag:"programming"});


// todosList.showTag("programming");
// todosList.showTags();
// todosList.show('done');
todosList.showAll();