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
        this.showActiveMessage('add', this.id);
        this.getCurrentStatus('todo','done','doing');
        this.id++;
    },
    remove({id}){
        let prevStatus = this.findDataById(id)[0].name;
        const idx = this.findIdex(id);
        this.todos.splice(idx, 1);
        this.showActiveMessage('remove', id, prevStatus);
        this.getCurrentStatus('todo','done','doing');
    },
    update({id,  nextstatus}){
        let prevStatus = this.findDataById(id)[0].status;
        this.findDataById(id)[0].status = nextstatus.toLowerCase();
        this.showActiveMessage('update', id, prevStatus);
        this.getCurrentStatus('todo','done','doing');
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
    getCurrentStatus(todo, done, doing){
        let todo_count,done_count,doing_count;

        this.todos.forEach((v) => {
            if(v.status === todo){
                todo_count = (todo_count)  ? todo_count + 1 : 1;
            }
            if(v.status === done){
                done_count = (done_count)  ? done_count + 1 : 1;
            }
            if(v.status === doing){
                doing_count = (doing_count)  ? doing_count + 1 : 1;
            }
        })
        this.showCurrentStatus(todo_count, done_count, doing_count);
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
todosList.update({id:1,  nextstatus:"doNe"});