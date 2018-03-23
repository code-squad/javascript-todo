const enumCheck = (checkData, enumData) => {
    return !!enumData[checkData]
}
const notNumber = number => isNaN(Number(number))

const command = (function () {
    const errMsg = {
        notActions: `명령어는 add show done 중 하나입니다. ex) show$todo`,
        wrongState: 'state는  todo, dpoing, done 중 하나입니다',
        notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
        notHaveThisId: '해당 id 값이 없습니다'
    }
    const enums = {}
    enums.actions = {
        add: 'add',
        show: 'show',
        update: 'update',
    }
    enums.state = {
        todo: 'todo',
        doing: 'doing',
        done: 'done',
    }
    const todos = {};
    todos.id = 0;
    todos.stateCounter = {
        todo: 0,
        doing: 0,
        done: 0,
    };
    const todoController = {
        compileOrder(order) {
            const [actions, target, update] = order.split('$');
            if (!enumCheck(actions, enums.actions)) throw new Error(errMsg.notActions)
            this.todoActions[actions](target, update);
        },
        todoActions: {
            add(todo) {
                todos.id += 1
                todos[todos.id] = {
                    id: todos.id,
                    todo,
                    state: enums.state.todo,
                }
                todos.stateCounter.todo += 1;
                this.printAdded();
                this.printState();
            },
            show(state) {
                if (!enumCheck(state, enums.state)) throw new Error(errMsg.wrongState)
                let tasks = this.getOnlyTaskData(todos);
                const filtered = Object.values(tasks).filter(task => task.state === state);
                this.printSameState(filtered, state)
            },
            update(id, state) {
                //ErrorCheck
                if (!enumCheck(state, enums.state)) throw new Error(errMsg.wrongState)
                if (notNumber(id)) throw Error(errMsg.notNumber)
                if (!this.validIdCheck(id)) throw Error(errMsg.notHaveThisId)
                // update
                let beforeState = todos[id].state;
                todos[id].state = state;
                todos.stateCounter[beforeState] -= 1;
                todos.stateCounter[state] += 1;
                this.stateCount(todos);
            },
            validIdCheck(id) {
                let tasks = this.getOnlyTaskData(todos);
                return !!tasks[id];
            },
            printState() {
                console.log(`현재상태 : todo: ${todos.stateCounter.todo}개 doing: ${todos.stateCounter.doing}개 done: ${todos.stateCounter.done}개`)
            },
            printAdded() {
                console.log(`id: ${todos.id} ${todos[todos.id].todo} 항목이 추가 되었습니다`)
            },
            printSameState(filterList, state) {
                console.log(`원하는 상태목록은 :D ${state}`)
                filterList.forEach(todo => {
                    console.log(`${todo.id}, ${todo.todo}`)
                })
            },
            initState() {
                const stateCounter = todos.stateCounter;
                stateCounter.todo = 0;
                stateCounter.doing = 0;
                stateCounter.done = 0;
            },
            getOnlyTaskData(todos) {
                let copy = Object.assign({}, todos)
                delete copy.id;
                delete copy.stateCounter;
                return copy;
            },
            stateCount(todos) {
                this.initState();
                let tasks = this.getOnlyTaskData(todos);

                const stateCounter = todos.stateCounter
                Object.values(tasks).forEach(
                    todo => stateCounter[todo.state] += 1
                );
            },
        }
    }
    return todoController.compileOrder.bind(todoController);
})();



command('add$자바스크립트공부');
command('add$ES6공부');
command('add$TIL 블로그 글 쓰기');
command('add$이전에 짠 것들 Refactoring하기');
command('add$Express 공부');

command('show$todo');

command('update$10$doing');


// command('update$1$doing');
// command('update$1$done');


// ErroCheck

// command('update$10$doing');
// command('shows$todos');
// command('show$todos');