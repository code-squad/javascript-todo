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
    
};

let todoMessage = {
    getCurrentStatus(statusList){
        const countObj = {todo:0, done:0, doing:0};
        todosList.todos.forEach((v)=> {
            if(statusList.indexOf(v.status) >= 0) ++countObj[v.status];
        });
        console.log(`현재상태 :  todo:${countObj.todo}개, doing:${countObj.doing}개, done:${countObj.done}개`);
    },
    showActiveMessage([activeType, id, name, status], update_status){
        (activeType === 'add') ? console.log(`id: ${this.id} ${name}항목이 새로 추가되었습니다.`) :
        (activeType === 'remove') ? console.log(`id:${id}, ${name} 삭제완료.`) :
        (activeType === 'update') ? console.log(`id:${id},  "${name}" 항목이 ${status} => ${update_status} 상태로 업데이트 됐습니다.`) :
        '';
        this.getCurrentStatus(todosList.statusList);
    },
    showTag(tagName){
        // 태그 네임을 인자로 받는다.
        // 각 상태에 따라 출력을 한다.
        // 각 상태에 따른 총 개수를 어떻게 구할지 고민해볼것.
        this.getTagData('todo');
    },
    getTagData(status){
        console.log(`[ ${status} , 총 개 ]`);
        let data_arr = todosList.todos.filter((v) => v.status === status)
                    .forEach((v,i) => {
                        console.log(
                        `- ${v.status}, ${v.name}`
                        )
                    });
    },
    showTags(){
        this.getTagData();
    },
    getTags(tagName){

    },
    show(status){

    },
    showAll(){

    }
}

todosList.add({name: "자바스크립트 공부하기", tag:"programming"});
todosList.add({name: "자료구조 공부하기", tag:"programming"});
todosList.update({id:2,  nextstatus:"doing"});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.remove({id:2});
todosList.update({id:3,  nextstatus:"done"});
todosList.remove({id:3});
todosList.add({name: "OS 공부하기", tag:"programming"});
todoMessage.showTag();



// 고려해야 할 점
// 모든태그, 특정태그, 모든리스트, 특정상태리스트를 모두 고려해야 한다.
// doing -> done까지 걸린 시간을 체크해야 한다.
// 별도의 객체를 분리하여도 된다. 