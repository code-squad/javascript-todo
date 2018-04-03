const CheckType = require('./utils');

const errMsg = {
    notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
    wrongTodoState: 'state는  todo, doing, done 중 하나입니다',
    notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
    notHaveThisId: '해당 id 값이 없습니다',
    emptyTask: `todo에 내용이 없습니다`
}

const printTodos = {
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
        this.slowest,
        this.actionsKey = ['add', 'show', 'update']
        this.statesKey = ['todo', 'doing', 'done']
    }
    takerOrder(parseOrder){
        const {action, target, update} = parseOrder
        if(this.actionsKey.indexOf(action)=== -1) throw Error(errMsg.notActions)
        this[action](target,update)
    }
    add(todo){
        const checkEmptyString = todo.trim()
        if(!checkEmptyString) throw new Error(errMsg.emptyTask)
        this.currentId +=1
        const newTodo = new Todo(this.currentId, todo)
        this.todos[this.currentId] = newTodo;
        this.stateCounter.todo +=1
        newTodo.addTimeInfo(newTodo.state)
        printTodos.added(this)
    }
    updateStateCounter(lastState, nowState){
        this.stateCounter[lastState]-=1
        this.stateCounter[nowState]+=1
    }
    show(state){
        if( this.statesKey.indexOf(state)=== -1) throw Error(errMsg.wrongTodoState)
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
       if (CheckType.notNumber(id)) throw Error(errMsg.notNumber)        
       if (!this.todos[id]) throw new Error(errMsg.notHaveThisId)        
        const willUpdatedOne = this.todos[id]
        const lastState = willUpdatedOne.getState()        
        willUpdatedOne.update(state)
        this.updateStateCounter(lastState, state);
        this.updateTime(id, state)
        printTodos.updated(this, id)
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





const command = order => (todos = new Todos('$ToDo')) => {
    const [action, target, update] = order.split('$');
    const parseOrder = {
        action,
        target,
        update,
    }
    return todos.takerOrder(parseOrder)
}

command('add$자바스크립트공부')
command('add$ES6공부')
command('show$todo')
command('update$1$doing');

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