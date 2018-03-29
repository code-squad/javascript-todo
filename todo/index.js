const CheckType = {
    enumCheck(checkData, enumData) {
        return !!enumData[checkData]
    },
    notNumber(number) {
        return isNaN(Number(number))
    }
}


const command = (function () {
    const errMsg = {
        notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
        wrongTodoState: 'state는  todo, dpoing, done 중 하나입니다',
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
        printMethod: {
            added: 'added',
            updated: 'updated',
            showSameStates: 'showSameStates',
        }
    }
    const todos = {
        id: 0,
        todoStateCounter: {
            todo: 0,
            doing: 0,
            done: 0,
        }
    };
    const printTodo = (printMethod, printKey)=> {
        const controller = {
            added(){
                console.log(`id: ${todos.id} ${todos[todos.id].todo} 항목이 추가 되었습니다`)
                this.showStateCounter();
            },
            showStateCounter(){
              console.log(`현재상태 : todo: ${todos.todoStateCounter.todo}개 doing: ${todos.todoStateCounter.doing}개 done: ${todos.todoStateCounter.done}개`)
            },
            updated(id) {
                console.log(`업데이트 된 todo는 `, `id: ${todos[id].id} todo: ${todos[id].todo} 상태:  ${todos[id].todoState}`)
                this.showStateCounter();
                if (todos[id].todoState === enums.todoState.done) {
                    this.getSpendTime(id)
                }
            },
            getSpendTime(id) {
                console.log('todos[id].tiem.spentTime', todos[id].time.spentTime)
                const {hours, mins, seconds} = todos[id].time.spentTime
                console.log(`걸린시간은 ${hours} ${mins} ${seconds}`)
            },
            showSameStates(sameStates) {
                console.log(sameStates);
            },
            
        }
        return controller[printMethod](printKey);
    }
    const todoController = {
        compileOrder(order) {
            const [actions, target, update] = order.split('$');
            if (!CheckType.enumCheck(actions, enums.actions)) console.log(errMsg.notActions)
            this.todoActions[actions](target, update)
        },
        todoActions: {
            add(todo) {
                todos.id += 1
                todos[todos.id] = {
                    id: todos.id,
                    todo,
                    todoState: enums.todoState.todo,
                    time: {},
                }
                this.updateTime(todos.id, todos[todos.id].todoState)
                todos.todoStateCounter.todo += 1;
                const  {added} = enums.printMethod
                return printTodo(added)
            },
            findSameState(filterList, todoState) {
                return filterList.reduce((result, todo) => {
                    return result += `${todo.id}, ${todo.todo}\n`
                }, `원하는 상태목록은 :D ${todoState}\n`)
            },
            show(todoState) {
                if (!CheckType.enumCheck(todoState, enums.todoState)) console.log(errMsg.wrongTodoState)
                let tasks = this.getOnlyTaskData(todos);
                const filtered = Object.values(tasks).filter(task => task.todoState === todoState);
                const sameStates =  this.findSameState(filtered, todoState)
                const  {showSameStates} = enums.printMethod
                printTodo(showSameStates, sameStates)
            },
            update(id, todoState) {
                //ErrorCheck
                if (!CheckType.enumCheck(todoState, enums.todoState)) console.log(errMsg.wrongTodoState)
                if (CheckType.notNumber(id)) console.log(errMsg.notNumber)
                if (!this.validIdCheck(id)) console.log(errMsg.notHaveThisId)
                // update
                let beforeState = todos[id].todoState;
                todos[id].todoState = todoState;
                this.updateTime(id, todoState)
                todos.todoStateCounter[beforeState] -= 1;
                todos.todoStateCounter[todoState] += 1;
                const  {updated} = enums.printMethod
                return printTodo(updated, id)
            },
            updateTime(id, todoState) {
                todos[id].time[todoState] = new Date();
                if (todoState === enums.todoState.done) this.spentTime(id);
            },
            caclTime(timeGap) {
                const hours = parseInt((timeGap / 3600))
                let resttime = timeGap - hours * 3600
                const mins = parseInt((resttime / 60))
                resttime = resttime - mins * 60
                const seconds = resttime;
                return {hours,mins,seconds,}
            },
            spentTime(id) {
                if (enums.todoState.done && enums.todoState.doing in todos[id].time) {
                    const {doing, done,} = todos[id].time;
                    const timeGap = parseInt((done.getTime() - doing.getTime()) / 1000);
                    const spentTime = this.caclTime(timeGap)
                    todos[id].time.spentTime = spentTime
                }
            },
            validIdCheck(id) {
                let tasks = this.getOnlyTaskData(todos);
                return !!tasks[id];
            },
            initState() {
                const todoStateCounter = todos.todoStateCounter;
                todoStateCounter.todo = 0;
                todoStateCounter.doing = 0;
                todoStateCounter.done = 0;
            },
            getOnlyTaskData(todos) {
                let copy = Object.assign({}, todos)
                delete copy.id;
                delete copy.todoStateCounter;
                return copy;
            },
            stateCount(todos) {
                this.initState();
                let tasks = this.getOnlyTaskData(todos);
                const todoStateCounter = todos.todoStateCounter
                Object.values(tasks).forEach(
                    todo => todoStateCounter[todo.todoState] += 1
                );
            },
        }

    }

    return todoController.compileOrder.bind(todoController);
})();


try {
    command('add$자바스크립트공부')
    command('add$ES6공부');
    command('add$TIL 블로그 글 쓰기');
    command('add$이전에 짠 것들 Refactoring하기');
    command('add$Express 공부');

    command('show$todo');

    command('update$1$doing');
    command('update$1$done');

    //에러 검출 
    // command('update$10$doing');
    // command('show$todo');
    // command('shows$todos');
    // command('show$todos');
} catch (e) {
    console.log('에러메시지', e);
}

function timeDelay(arr, time, i=0) {
    if (arr.length === i) return;
    setTimeout(() => {
        command(arr[i]);
        i+=1;
        return timeDelay(arr, time, i);
    }, time)
}

// timeDelay(['add$ES6공부', 'add$자바스크립트공부', 'add$TIL 블로그 글 쓰기', 'update$1$doing', 'update$1$done'], 2000);