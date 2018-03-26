const enumCheck = (checkData, enumData) => {
    return !!enumData[checkData]
}
const notNumber = number => isNaN(Number(number))

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
    const printTodo = {
        Added() {
            console.log(`id: ${todos.id} ${todos[todos.id].todo} 항목이 추가 되었습니다`)
        },
        todoState() {
            console.log(`현재상태 : todo: ${todos.todoStateCounter.todo}개 doing: ${todos.todoStateCounter.doing}개 done: ${todos.todoStateCounter.done}개`)
        },
        updated(id) {
            console.log(`업데이트 된 todo는 `, `id: ${todos[id].id} todo: ${todos[id].todo} 상태:  ${todos[id].todoState}`)
        },
        printSameState(filterList, todoState) {
            let result = ''
            result += `원하는 상태목록은 :D ${todoState}\n`
            filterList.forEach(todo => {
                result += `${todo.id}, ${todo.todo}\n`
            })
            console.log(result);
        },
    }
    const todoController = {
        compileOrder(order) {
            const [actions, target, update] = order.split('$');
            if (!enumCheck(actions, enums.actions)) console.error(errMsg.notActions)
            this.todoActions[actions](target, update);
        },
        todoActions: {
            add(todo) {
                todos.id += 1
                todos[todos.id] = {
                    id: todos.id,
                    todo,
                    todoState: enums.todoState.todo,
                }
                todos.todoStateCounter.todo += 1;
                printTodo.Added();
                printTodo.todoState();
            },
            show(todoState) {
                if (!enumCheck(todoState, enums.todoState)) console.error(errMsg.wrongTodoState)
                let tasks = this.getOnlyTaskData(todos);
                const filtered = Object.values(tasks).filter(task => task.todoState === todoState);
                printTodo.printSameState(filtered, todoState)
            },
            update(id, todoState) {
                //ErrorCheck
                if (!enumCheck(todoState, enums.todoState)) console.error(errMsg.wrongTodoState)
                if (notNumber(id)) console.error(errMsg.notNumber)
                if (!this.validIdCheck(id)) console.error(errMsg.notHaveThisId)
                // update
                let beforeState = todos[id].todoState;
                todos[id].todoState = todoState;
                todos.todoStateCounter[beforeState] -= 1;
                todos.todoStateCounter[todoState] += 1;
                printTodo.updated(id)
                printTodo.todoState();
                this.stateCount(todos);
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
    command('add$자바스크립트공부');
    command('add$ES6공부');
    command('add$TIL 블로그 글 쓰기');
    command('add$이전에 짠 것들 Refactoring하기');
    command('add$Express 공부');

    command('show$todo');

    command('update$1$doing');
    // command('update$10$doing');
    // command('shows$todos');
    // command('show$todos');
} catch (e) {
    console.log('에러메시지', e);
}



// command('update$1$doing');
// command('update$1$done');


// ErroCheck