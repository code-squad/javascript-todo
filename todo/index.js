// Flow 
// Command함수가 Order를 받아서 Compiler함수에게 전달  
// Compiler -> Order 를 번역해서 -> Controller에게 전달 
// Controller 에서 번역된 명령어에 맞춰서 todos객체와 -> print객체에 전달해준다.
const CheckType = require('./utils');

// constants
const errMsg = {
    notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
    wrongTodoState: 'state는  todo, doing, done 중 하나입니다',
    notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
    notHaveThisId: '해당 id 값이 없습니다'
}

const enums = {
    actions: {
        add: 'add',
        show: 'show',
        update: 'update',
    },
    todoState: {
        todo: 'todo',
        doing: 'doing',
        done: 'done',
    },
}

const Seconds = 1000;


// Models
const printController = {
    added(){
        const addedOne = todos.todos[todos.currentId]
        const { id, task } = addedOne
        console.log(`id: ${id} ${task} 항목이 새로 추가 되었습니다.`)
        this.printStateCounter()
    },
    printStateCounter(){
        const {todo, doing, done} =  todos.stateCounter
        console.log(`현재상태ㅣ todo: ${todo} 개 doing: ${doing} 개 done: ${done}개`)
    },
    updated(ID){
        const updatedOne = todos.todos[ID]
        const {task, state, id} = updatedOne
        console.log(`업데이트 된 todo는 id: ${id} todo: ${task}:  ${state}\n`);
        this.printStateCounter();
        if(state === 'done') {
            this.getSpentTime(updatedOne);
        }
    },
    getSpentTime(updatedOne){
        const { hours, mins, seconds} = updatedOne.time.spentTimeHMS
        console.log(`${updatedOne.id} ${updatedOne.task}의 걸린시간은 ${hours} 시간 ${mins} 분 ${seconds} 초\n`)
    },
}


class Todo {
    constructor(id, task){
        this.id = id,
        this.task = task
        this.state = 'todo'
        this.time = {}
    }
    update(state){
        this.state = state;
    }
    getState(){
        return this.state;
    }
    addTimeInfo(state){
        this.time[state] = new Date();
    }
    setTimeInfo(state, timeInfo){
        this.time[state] = timeInfo;
    }
    recordSpendTime(){
        const timeGap = this.time.done - this.time.doing
        this.time.spentTime =  parseInt(timeGap/Seconds)
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

class Todos {
    constructor(name){
        this.name = "",
        this.todos = {}
        this.currentId = 0,
        this.stateCounter = {
            todo: 0,
            doing: 0,
            done: 0,
        }
        this.fastest,
        this.slowest
    }
    add(todo){
        const newTodo = this.make(todo)
        this.todos[this.currentId] = newTodo;
        this.todoAddStateCounter()
        this.updateTime(this.currentId, newTodo.getState())
    }
    todoAddStateCounter(){
        this.stateCounter.todo += 1
    }
    updateStateCounter(lastState, nowState){
        this.stateCounter[lastState]-=1
        this.stateCounter[nowState]+=1
    }
    make(todo){
        this.currentId +=1
        const newTodo = new Todo(this.currentId,todo)
        return newTodo;
    }
    show(state){
        const sameStateTodos = this.getSameState(state)
        this.printSameTasks(sameStateTodos, state)
    }
    getSameState(state){
        const todos = Object.values(this.todos);
        const sameStateTodos = todos.filter(todo => todo.state === state)
        return sameStateTodos;
    }
    printSameTasks(todos, state) {
        const resultTasks = todos.reduce((ac, todo) => {
            return ac += `${todo.id}, ${todo.task}\n`
        }, `원하는 상태목록은 :D ${state}\n`)
        console.log(resultTasks)
    }
    update(id, state){
       if (!this.validIdCheck(id)) throw new Error(errMsg.notHaveThisId)        
        const willUpdatedOne = this.todos[id]
        const lastState = willUpdatedOne.getState()        
        willUpdatedOne.update(state)
        this.updateStateCounter(lastState, state);
        this.updateTime(id, state)
    }
    validIdCheck(id){
        return !!this.todos[id]
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

const todos = new Todos('$ToDo')

const command = order => {
    return compileOrder(order);
}
const compileOrder = order => {
    const [actions, target, update] = order.split('$');
    if (!CheckType.enumCheck(actions, enums.actions)) console.log(errMsg.notActions)
    return Controller[actions](target,update)    
}

const Controller = {
    add(todo){
        todos.add(todo);
        printController.added();
    },
    show(state){
        if(!CheckType.enumCheck(state, enums.todoState)) throw Error(errMsg.wrongTodoState)
        todos.show(state);
    },
    update(id, state){
       if (CheckType.notNumber(id)) throw Error(errMsg.notNumber)
       todos.update(id, state)
       printController.updated(id)
    },
}

command('add$자바스크립트공부')
command('add$ES6공부')
command('add$React공부')
command('show$todo');
command('update$1$doing');

 //에러 검출
// command('show$todos');
// command('update$10$doing');
 


function timeDelay(arr, time, i = 0) {
    if (arr.length === i) return;
    setTimeout(() => {
        command(arr[i]);
        i += 1;
        return timeDelay(arr, time, i);
    }, time)
}

timeDelay(['update$3$doing', 'update$3$done'], 1000);
timeDelay(['add$TIL 블로그 글 쓰기', 'update$2$doing', 'update$2$done'], 2000);