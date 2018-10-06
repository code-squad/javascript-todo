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
        let prev_data = this.getPrevData('update', id);
        for(let o of this.todos){
            if(o.id === id) {
                o.status = nextstatus.toLowerCase();
            }
        };
        todoMessage.showActiveMessage(prev_data, nextstatus.toLowerCase());
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

let todoMessage = {
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
        this.showMessage(requiredData);
    },
    showTags(){
        let requiredData = this.getRequiredData(todosList.todos, 'tag');
        this.showMessage2(requiredData);
    },
    show(status){
        let requiredData = this.getRequiredData(todosList.todos, 'tag', 'status', status);
        this.showMessage3(requiredData, status);
    },
    showAll(){
        let requiredData = this.getRequiredData(todosList.todos, 'status');
        this.showMessage4(requiredData, 'status');
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
        return requiredData;
    },
    showMessage(inputData){
        let countObj = this.getCurrentStatus(inputData, 'status');
        let status_count_check = [];
        inputData.reduce((acc, curr,i) => {
            status_count_check.push(curr.status);
            if(status_count_check.indexOf(curr.status) == i){
                console.log(`[ ${curr.status} , 총${countObj[curr.status]}개 ]`)
            }
                console.log(`- ${curr.id}번, ${curr.name}`)
            return curr;
        },'');
    },
    showMessage2(inputData){
        let countObj = this.getCurrentStatus(inputData, 'tag');
        let tag_count_check = [];
        inputData.reduce((acc, curr,i) => {
            tag_count_check.push(curr.tag);
            if(tag_count_check.indexOf(curr.tag) == i){
                console.log(`[ ${curr.tag} , 총${countObj[curr.tag]}개 ]`)
            }
                console.log(`- ${curr.id}번, ${curr.name}[${curr.status}]`)
            return curr;
        },'');
    },
    showMessage3(inputData, status){
        let countObj = this.getCurrentStatus(inputData, status);
        let tag_count_check = [];
        inputData.reduce((acc, curr,i) => {
            tag_count_check.push(curr.tag);
            console.log(`- ${curr.id}번, ${curr.name}[${curr.tag}]`)
            return curr;
        },'');
    },
    showMessage4(inputData, status){
        let countObj = this.getCurrentStatus(inputData, status);
        let tag_count_check = [];
        inputData.reduce((acc, curr,i) => {
            tag_count_check.push(curr.status);
            if(tag_count_check.indexOf(curr.status) == i){
                console.log(`[ ${curr.status} , 총${countObj[curr.status]}개 ]`)
            }
                console.log(`- ${curr.id}번, ${curr.name}[${curr.tag}]`)
            return curr;
        },'');
    },
    getAsyncTime(){
        
    },
    
}

todosList.add({name: "자바스크립트 공부하기", tag:"study"});
todosList.add({name: "자료구조 공부하기", tag:"programming"});
todosList.update({id:2,  nextstatus:"doing"});
todosList.add({name: "OS 공부하기", tag:"game"});
todosList.update({id:3,  nextstatus:"done"});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.add({name: "여행가기", tag:"play"});
todosList.add({name: "OS", tag:"programming"});
todosList.add({name: "ios", tag:"programming"});
// todoMessage.showTag("programming");
todoMessage.showTags();
// todoMessage.show('todo');
// todoMessage.showAll();


// 고려해야 할 점
// 모든태그, 특정태그, 모든리스트, 특정상태리스트를 모두 고려해야 한다.
// doing -> done까지 걸린 시간을 체크해야 한다.
// 별도의 객체를 분리하여도 된다. 