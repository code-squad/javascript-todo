const todosList = {
    todos : [],
    id : 1,
    statusList : ['todo','done','doing'],
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
        let prev_data = this.getPrevData('remove', id);
        this.todos = this.todos.filter((target)=>target.id !== id);
        todoMessage.showActiveMessage(prev_data);
    },
    update({id,  nextstatus}){
        nextstatus = nextstatus.toLowerCase();
        let prev_data = this.getPrevData('update', id);
        for(let o of this.todos){
            if(o.id === id) {
                o.status = nextstatus;
                (nextstatus === 'doing')? o.startTime = stopWatch.start() : o.elapsedTime = stopWatch.stop(o.startTime);
            }
        };
        todoMessage.showActiveMessage(prev_data, nextstatus);
    },
    getPrevData(funcName, id){
        let prev_data = {
            prevName: '', 
            idx: 0
        };
        for(let o of this.todos){
            if(o.id === id){
                prev_data.prevName = o.name;
                prev_data.prevStatus = o.status;
                prev_data.idx = o.id;
            }
        };
        return [funcName ,id ,prev_data.prevName, prev_data.prevStatus];
    },
    getTags(todosList, valueType){
        let countObj = (valueType === 'status') ? {todo: 0, doing: 0, done: 0} : {};
        todosList.forEach((target)=> {
            countObj[target[valueType]] = 0;
        });
        return countObj;
    },
    getsortData(countObj, criteria){
        return countObj.sort((a,b) => {
            return a[criteria] < b[criteria]; 
        })
    }
};

const todoMessage = {
    getCurrentStatus(data, valueType){
        const countObj =  todosList.getTags(todosList.todos, valueType);
        data.forEach((v)=> {
            ++countObj[v[valueType]];
        });
        return countObj;
    },
    showActiveMessage([activeType, id, name, status], update_status){
        (activeType === 'add') ? console.log(`id: ${id} ${name}항목이 새로 추가되었습니다.`) :
        (activeType === 'remove') ? console.log(`id:${id}, ${name} 삭제완료.`) :
        (activeType === 'update') ? console.log(`id:${id},  "${name}" 항목이 ${status} => ${update_status} 상태로 업데이트 됐습니다.`) :
        '';
        let countObj = this.getCurrentStatus(todosList.todos, 'status');
        console.log(`현재상태 :  todo:${countObj.todo}개, doing:${countObj.doing}개, done:${countObj.done}개`);
    },
    showTag(tagName){
        let requiredData = this.getRequiredData(todosList.todos, 'status', 'tag', tagName);
        this.showMessage(requiredData, 'status');
    },
    showTags(){
        let requiredData = this.getRequiredData(todosList.todos, 'tag');
        this.showMessage(requiredData, 'tag');
    },
    show(status){
        let requiredData = this.getRequiredData(todosList.todos, 'tag', 'status', status);
        this.showMessage(requiredData, status);
    },
    showAll(){
        let requiredData = this.getRequiredData(todosList.todos, 'status');
        this.showMessage(requiredData, 'status', 'showAll');
    },
    showMessage(inputData, key, checkAsync){
        let countObj = this.getCurrentStatus(inputData, key);
        let requiredValueObj = {};
        for(let value in countObj){
            requiredValueObj[value] = '';
        }
        inputData.reduce((acc, curr,i) => {
            requiredValueObj[curr[key]] += `-${curr.id}번, ${curr.name} ${(curr.status === 'done')? curr.elapsedTime+' msec':''} \n`;
            return curr;
        }, requiredValueObj);
        this.getAsyncTime(requiredValueObj);
        if(checkAsync){ getRequiredData(requiredValueObj) }
        for(let value in requiredValueObj){
            if(value !== 'undefined'){
                console.log(`[ ${value} , 총${countObj[value]}개 ]`);
            }
            console.log(`${requiredValueObj[value]}`);
        }
    },
    getRequiredData(data, sortElement, kind, value){
        let requiredData = [];
        let showTagValue = data;
        if(value){
            showTagValue = data.filter((v) => v[kind] === value);
        }
        showTagValue = todosList.getsortData(showTagValue, sortElement);
        showTagValue.forEach((v,i) => {
            requiredData.push(v);
        })
        console.log(requiredData)
        return requiredData;
    },
    getAsyncTime(obj, statusCheckj){
        const delayTime = {
            todo: 2000, 
            doing: 3000,
            done: 2000
        }
        for(let statusCheck in obj){
            console.log("world");
            setTimeout(() => { 
                console.log("hello");
                this.getAsyncTime(obj, statusCheck);
            }, delayTime[statusCheck]);
        }
    },
}

const stopWatch = {
    startTime : 0,
    ElapsedTime : 0,
    start(){
        this.startTime = new Date().getTime();
        return this.startTime;
    },
    stop(start){
        this.ElapsedTime = new Date().getTime() - start;
        return this.ElapsedTime
    }
}

todosList.add({name: "자바스크립트 공부하기", tag:"study"});
todosList.add({name: "자료구조 공부하기", tag:"programming"});
todosList.update({id:2,  nextstatus:"doing"});
todosList.add({name: "OS 공부하기", tag:"game"});
todosList.update({id:2,  nextstatus:"done"});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.update({id:3,  nextstatus:"doing"});
todosList.update({id:4,  nextstatus:"doing"});
todosList.add({name: "여행가기", tag:"play"});
todosList.add({name: "OS", tag:"programming"});
todosList.update({id:3,  nextstatus:"done"});
todosList.add({name: "ios", tag:"programming"});
todoMessage.showTag("programming");
// todoMessage.showTags();
// todoMessage.show('done');
// todoMessage.showAll();


// 고려해야 할 점
// 모든태그, 특정태그, 모든리스트, 특정상태리스트를 모두 고려해야 한다.
// doing -> done까지 걸린 시간을 체크해야 한다.
// 별도의 객체를 분리하여도 된다. 