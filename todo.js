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
        this.showActiveMessage('add', this.id);
        this.getCurrentStatus(this.statusList);
        this.id++;
    },
    remove({id}){
        let prevStatus = this.findDataById(id)[0].name;
        const idx = this.findIdex(id);
        this.todos.splice(idx, 1);
        this.showActiveMessage('remove', id, prevStatus);
        this.getCurrentStatus(this.statusList);
    },
    update({id,  nextstatus}){
        let prevStatus = this.findDataById(id)[0].status;
        this.findDataById(id)[0].status = nextstatus.toLowerCase();
        this.showActiveMessage('update', id, prevStatus);
        this.getCurrentStatus(this.statusList);
    },
    findIdex(id){
        return this.todos.findIndex((v) => v.id === this.findDataById(id)[0].id);
    },
    findDataById(id){
        return this.todos.filter((v) => v.id === id);
    },
    showActiveMessage(activeType, id, prevStatus){
        (activeType === 'add') ? console.log(`id: ${this.id} ${this.findDataById(id)[0].name} 항목이 새로 추가되었습니다.`) :
        (activeType === 'remove') ? console.log(`id:${id}, ${prevStatus} 삭제완료.`) :
        (activeType === 'update') ? console.log(`id:${id},  "${this.findDataById(id)[0].name}" 항목이 ${prevStatus} => ${this.findDataById(id)[0].status} 상태로 업데이트 됐습니다.`) :
        console.log('');
    },
    getCurrentStatus(statusList){
        const countObj = {todo:0, done:0, doing:0}
        this.todos.forEach((v)=> {
            if(statusList.indexOf(v.status) < 0) return;
            countObj[v.status] = (countObj[v.status])  ? countObj[v.status] + 1 : 1;
        });
        this.showCurrentStatus(countObj.todo, countObj.done, countObj.doing);
    },
    showCurrentStatus(todo=0, done=0, doing=0){
        console.log(`현재상태 :  todo:${todo}개, doing:${doing}개, done:${done}개`);
    },
};

todosList.add({name: "자바스크립트 공부하기", tag:"programming"});
todosList.add({name: "자바스크립트 공부하기", tag:"programming"});
todosList.add({name: "알고리즘 공부하기", tag:"programming"});
todosList.add({name: "자료구조 공부하기", tag:"programming"});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.remove({id:2});
todosList.remove({id:3});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.remove({id:4});
todosList.remove({id:5});
todosList.add({name: "OS 공부하기", tag:"programming"});
todosList.remove({id:6});
todosList.update({id:1,  nextstatus:"doNe"});