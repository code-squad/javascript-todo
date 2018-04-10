const notNumber = function(number) {
    return isNaN(Number(number))
}  

const errMsg = {
    notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
    wrongTodoState: 'state는  todo, doing, done 중 하나입니다',
    notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
    notHaveThisId: '해당 id 값이 없습니다',
    emptyTask: `todo에 내용이 없습니다`
}

const PrintTodo = {
    added(todos){
        const addedOne = todos.todos[todos.currentId]
        const { id, task } = addedOne
        console.log(`id: ${id} ${task} 항목이 새로 추가 되었습니다.`)
        this.stateCounter(todos.stateCounter)
    },
    stateCounter(stateCounter){
        const {todo, doing, done} =  stateCounter
        console.log(`현재상태ㅣ todo: ${todo} 개 doing: ${doing} 개 done: ${done}개`)
    },
    updated(todos, ID){
        const updatedOne = todos.todos[ID]
        const {task, state, id} = updatedOne
        console.log(`업데이트 된 todo는 id: ${id} todo: ${task}:  ${state}\n`);
        this.stateCounter(todos.stateCounter);
        if(state === 'done') {
            this.spentTime(updatedOne, todos);
        }
    },
    spentTime(updatedOne, todos){
        const { hours, mins, seconds} = updatedOne.time.spentTimeHMS
        console.log(`${updatedOne.id} ${updatedOne.task}의 걸린시간은 ${hours} 시간 ${mins} 분 ${seconds} 초\n`)
        console.log('가장 빨리 끝낸 일', todos.fastest, '가장 늦게 끝낸 일 ', todos.slowest);
    },
}


class Todo {
    constructor(id, task){
        this.id = id,
        this.task = task
        this.state = 'todo'
        this.time = {}
        this.Seconds = 1000;
    }
    update(state){
        this.state = state;
    }
    getState(){
        return this.state;
    }
    addTimeInfo(state){
        this.time[state] = new Date();
        if(state==='done'){
            this.recordSpendTime()
            this.convertToSpendTimeHMS(this.time.spentTime)
        } 
    }
    setTimeInfo(state, timeInfo){
        this.time[state] = timeInfo;
    }
    recordSpendTime(){
        const timeGap = this.time.done - this.time.doing
        this.time.spentTime =  parseInt(timeGap/this.Seconds)
    }
    convertToSpendTimeHMS() {
        const spentTime = this.time.spentTime
        const hours = parseInt((spentTime / 3600))
        let restTime = spentTime - hours * 3600
        const mins = parseInt((restTime / 60))
        restTime = restTime - mins * 60
        const seconds = restTime;
        return this.time.spentTimeHMS = {hours,mins,seconds,}
    }
}

const Todos = class {
    constructor(name, todos={}){
        this.name = name;
        this.todos = todos
        this.currentId = 0,
        this.stateCounter = {
            todo: 0,
            doing: 0,
            done: 0,
        }
        this.fastest,
        this.slowest,
        this.actionsKey = ['add', 'show', 'update']
        this.statesKey = ['todo', 'doing', 'done']
    }
    addCurrentId(currentId){
        return currentId +=1
    }
    addStateCounter(stateTodo){
        return stateTodo+=1
    }
    add(todo){
        if(!todo.trim()) console.log(errMsg.emptyTask)
        this.currentId = this.addCurrentId(this.currentId);
        const currentId = this.currentId;
        const newTodo = new Todo(currentId, todo)
        this.todos[currentId] = newTodo;
        this.stateCounter.todo = this.addStateCounter(this.stateCounter.todo);
        newTodo.addTimeInfo(newTodo.state)
    }
    show(state){
        const todos = this.todos
        const sameStates = Object.values(todos).filter(todo => todo.state===state)
        this.printSameTasks(sameStates, state)
    }
    printSameTasks(todos, state) {
        const resultTasks = todos.reduce((ac, todo) => {
            return ac += `${todo.id}, ${todo.task}\n`
        }, `원하는 상태목록은 :D ${state}\n`)
        console.log(resultTasks)
    }
    update(id, state){
        if (notNumber(id)) console.log(errMsg.notNumber)        
        if (!this.todos[id]) console.log(errMsg.notHaveThisId)        
         const willUpdatedOne = this.todos[id]
         const lastState = willUpdatedOne.getState()        
         willUpdatedOne.update(state)
         this.updateStateCounter(lastState, state);
         this.updateTime(id, state)
     }
     updateStateCounter(lastState, nowState){
        this.stateCounter[lastState]-=1
        this.stateCounter[nowState]+=1
    }
    updateTime(id, todoState) {
        const willUpdateTimeTodo = this.todos[id]
        willUpdateTimeTodo.addTimeInfo(todoState);
        if (todoState === 'done'){
            willUpdateTimeTodo.recordSpendTime();
            willUpdateTimeTodo.convertToSpendTimeHMS(willUpdateTimeTodo.spentTime)
            this.saveFastest(id)
            this.saveSlowest(id)
        }
    }
    saveFastest(id){
        this.fastest = this.fastest ? 
        this.todos[this.fastest].time.spentTime > this.todos[id].time.spentTime ? id : this.fastest
        : id  
    }
    saveSlowest(id){
        this.slowest = this.slowest ? 
        this.todos[this.slowest].time.spentTime < this.todos[id].time.spentTime ? id : this.slowest
        : id 
    }
}

const $Todos = new Todos('$todo', {})

// command('show$todo')
// command('update$1$doing');

// command('add$React공부')
// command('show$todo');
// command('update$1$doing');


$Todos.add('자바스크립트공부')
PrintTodo.added($Todos);
$Todos.add('ES6공부')
$Todos.add('React공부')
PrintTodo.added($Todos);
$Todos.show('todo')
$Todos.update(1,'doing')
PrintTodo.updated($Todos,1)
// $Todos.update(1,'doing')
// $Todos.update(3,'doing')
// $Todos.update(3,'done')


function timeDelay(arr, time, i = 0) {
    if (arr.length === i) return;
    setTimeout(() => {
        arr[i]();
        i += 1;
        return timeDelay(arr, time, i);
    }, time)
}

timeDelay([
    () => $Todos.update(1,'done'),
    ()=> $Todos.update(3,'doing'),
    ()=> $Todos.update(3,'done'),
    // ()=> console.log(JSON.stringify($Todos, null, 2))
]
    , 1000);

timeDelay([
    ()=> $Todos.update(2,'doing'),
    ()=> $Todos.update(2,'done'),
    ()=> console.log(JSON.stringify($Todos, null, 2))
]
    , 2000);
    
// console.log(JSON.stringify($Todos, null, 2));