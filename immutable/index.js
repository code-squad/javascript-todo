const notNumber = function(number) {
    return isNaN(Number(number))
}  

// Normal 
// this.time = {horus, mins, seconds} 이런 객체 할당
// this.time = updateState(this.time, hours)
function objUpdateByKeyValue(state, property, item ) {
    return Object.assign({}, state, {[property]: item});
}

function objUpdate(state, ...change){
	return Object.assign({}, state, ...change)
}


// With Object Spread:
// function updateState(state, item) {
//   return {
//      ...state,
//      [item.id]: item
//   };
// }


const errMsg = {
    notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
    wrongTodoState: 'state는  todo, doing, done 중 하나입니다',
    notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
    notHaveThisId: '해당 id 값이 없습니다',
    emptyTask: `todo에 내용이 없습니다`
}

//Print는 데이터를 읽기만 하므로 Pass

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

// Todo에서 Immutable로 Data를 변경할 수 있는 부분을 찾아보자 !!!
// time만 reference type -> Immutable하게 변경 

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
        this.time = objUpdateByKeyValue(this.time, state, new Date())
        if(state==='done'){
            this.recordSpendTime()
            this.convertToSpendTimeHMS(this.time.spentTime)
        } 
    }
    recordSpendTime(){
        const timeGap = this.time.done - this.time.doing
        this.time = objUpdateByKeyValue(this.time, 'spentTime', parseInt(timeGap/this.Seconds))
        // this.time.spentTime =  parseInt(timeGap/this.Seconds)
    }
    convertToSpendTimeHMS() {
        const spentTime = this.time.spentTime
        const hours = parseInt((spentTime / 3600))
        let restTime = spentTime - hours * 3600
        const mins = parseInt((restTime / 60))
        restTime = restTime - mins * 60
        const seconds = restTime;
        this.time.spentTimeHMS = objUpdate(this.time.spentTimeHMS, {hours},{mins},{seconds})
        // this.time.spentTimeHMS = {hours, mins, seconds}
    }
}


// Todos immutable로 변경 

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
    plusStateCounter(state){
        return objUpdate(this.stateCounter, {[state]: this.stateCounter[state]+1})
    }
    minusStateCounter(state){
        return objUpdate(this.stateCounter, {[state]: this.stateCounter[state]-1})
    }
    add(todo){
        if(!todo.trim()) console.log(errMsg.emptyTask)
        this.currentId = this.addCurrentId(this.currentId);
        const currentId = this.currentId;
        const newTodo = new Todo(currentId, todo)
        // immutable add
        this.todos = objUpdate(this.todos, {[currentId]: newTodo})
        this.stateCounter = this.plusStateCounter('todo')
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
        this.stateCounter = this.minusStateCounter(lastState)
        this.stateCounter = this.plusStateCounter(nowState)
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
PrintTodo.added($Todos);
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
    ()=> PrintTodo.updated($Todos,3),
    ()=> $Todos.update(3,'doing'),
    ()=> $Todos.update(3,'done'),
    ()=> PrintTodo.updated($Todos,3),
    // ()=> console.log(JSON.stringify($Todos, null, 2))
]
    , 1000);

timeDelay([
    ()=> $Todos.update(2,'doing'),
    ()=> $Todos.update(2,'done'),
    ()=> PrintTodo.updated($Todos,2),
    ()=> console.log(JSON.stringify($Todos, null, 2))
]
    , 2000);
    
// console.log(JSON.stringify($Todos, null, 2));