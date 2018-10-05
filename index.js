const todo = {};
const taskProgram = {
    taskArray: [],
    taskCount: 0,
    add(obj) {
        const newTodo = Object.create(todo)
        newTodo.id = taskProgram.taskCount;
        newTodo.name = obj.name;
        newTodo.tag = obj.tag;
        newTodo.state = 'todo'
        this.increaseTaskCount();
        this.taskArray.push(newTodo);
        return [console.log(`id : ${newTodo.id}, "${obj.name}"항목이 추가되었습니다.`), taskProgram.showState()]
    },
    increaseTaskCount() {
        this.taskCount++;
    },
    showState() {
        const stateTodo = this.taskArray.filter(v => v.state === 'todo')
        const stateDoing = this.taskArray.filter(v => v.state === 'doing')
        const stateDone = this.taskArray.filter(v => v.state === 'done')
        let todo, doing, done;
        [todo, doing, done] = [stateTodo.length, stateDoing.length, stateDone.length]
        return console.log(`현재상태 :  todo : ${todo}, doing : ${doing}, done : ${done} `)
    },
    update(obj) {
        let updatedStatus, id, updatedName
        [updatedStatus, id] = [obj.nextstatus, obj.id]
        this.taskArray.forEach(v => {
            if (v.id === id){
                updatedName = v.name 
                return v.state = updatedStatus
            } 

        })
        return console.log(`id : ${id}, "${updatedName}항목이 `)
    }
};
taskProgram.add({ name: '응가하기', tag: '신나는일' });
taskProgram.add({ name: '밥먹기', tag: '신나는일' });
taskProgram.update({ id: 1, nextstatus: 'done' });
