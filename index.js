const todo = {};
const taskProgram = {
    taskArray: [],
    taskCount: 0,
    add(obj) {
        const newTodo = Object.create(todo);
        [newTodo.id, newTodo.name, newTodo.tag, newTodo.state] = [taskProgram.taskCount, obj.name, obj.tag, 'todo'];
        this.increaseTaskCount();
        this.taskArray.push(newTodo);
        return [console.log(`id : ${newTodo.id}, "${obj.name}" 항목이 추가 되었습니다.`), taskProgram.showState()];
    },
    increaseTaskCount() {
        this.taskCount++;
    },
    showState() {
        const stateTodo = this.taskArray.filter(v => v.state === 'todo');
        const stateDoing = this.taskArray.filter(v => v.state === 'doing');
        const stateDone = this.taskArray.filter(v => v.state === 'done');
        let todo, doing, done;
        [todo, doing, done] = [stateTodo.length, stateDoing.length, stateDone.length];
        return console.log(`현재상태 :  todo : ${todo}, doing : ${doing}, done : ${done} `);
    },
    update(obj) {
        let updatedStatus, id, updatedName, paststate;
        [updatedStatus, id] = [obj.nextstatus, obj.id];
        this.taskArray.forEach(v => {
            if (v.id === id) {
                [updatedName, paststate, v.state] = [v.name, v.state, updatedStatus];
            }
        });
        console.log(`id : ${id}, "${updatedName}" 항목이 ${paststate} => ${updatedStatus} 상태로 업데이트 됐습니다 `);
        return this.showState();
    },
    remove(obj) {
        const removedtodo = this.taskArray.splice(this.taskArray[obj.id].id, 1);
        return console.log(`id : ${removedtodo[0].id}, "${removedtodo[0].name}" 삭제완료.`);
    }
};
taskProgram.add({ name: '숨쉬기', tag: '신나는일' });
taskProgram.add({ name: '밥먹기', tag: '신나는일' });
taskProgram.update({ id: 0, nextstatus: 'done' });
taskProgram.remove({ id: 0 });
