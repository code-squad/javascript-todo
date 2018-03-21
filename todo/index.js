// reg = new RegExp("^[\\w\\-]+(\\.[\\w\\-_]+)*@[\\w\\-]+(\\.[\\w\\-]+)*(\\.[a-zA-Z]{2,3})$", "gi");
// var re = new RegExp("ab+c");
// 정규표현식 없이 .split() 구현 or 정규표현식! 
// let result = target.match(r)
// JS에서 enum바로 true False로 체크해주는 거 있으면 좋겠다. 못 찾은 걸 수도 
const enumCheck = (checkData, enumData) => {
    return !!Object.values(checkData).filter(item => item === enumData).length;
}
const notNumber = number => isNaN(Number(number))

const command = (function () {
    const Actions = {
        Add: 'add',
        Show: 'show',
        Update: 'update',
    }
    const State = {
        Todo: 'todo',
        Doing: 'doing',
        Done: 'done',
    }
    const todos = {};
    let id = 0;

    const printType = {
        Filter: "filter",
        Add: "add",
    }
    const errMsg = {
        addWrongState: 'to do 볼 수 있는 상태는  todo, dpoing, done 중 하나입니다. ex) add$공부',
        updateWrongState: 'update할 수 있는 상태는  todo, dpoing, update 중 하나입니다. ex) update$1$done',
        notNumber: 'id 값은 숫자여야 합니다.  ex) update$1$done',
        notHaveThisId: '해당 id 값이 없습니다'
    }
    const stateCounter = {
        todo: 0,
        doing: 0,
        done: 0,
    }
    const controller = function (order) {

        const compileOrder = function (order) {

            const [first, second, last] = order.split('$');
            const actions = first;

            if (!enumCheck(Actions, actions)) throw new Error('명령어는 add show done 중 하나입니다. ex) show$todo')

            const stateUpdate = (before, update) => {
                stateCounter[before] -= 1
                stateCounter[update] += 1
            }
            const stateAddtoDo = () => {
                stateCounter.todo += 1
            }
            const stateInit = () => {
                stateCounter.todo = 0;
                stateCounter.doing = 0;
                stateCounter.done = 0;
            }

            const stateCheck = () => {
                stateInit();
                for (key in todos) {
                    let state = todos[key].state
                    switch (state) {
                        case State.Todo:
                            stateCounter[state] += 1;
                            break;
                        case State.Doing:
                            stateCounter[state] += 1;
                            break;
                        case State.Done:
                            stateCounter[state] += 1;
                            break;
                        default:
                            break;
                    }
                }
                return stateCounter;
            }

            const addTodo = (todo) => {
                id += 1;
                todos[id] = {
                    id,
                    todo,
                    state: State.Todo
                }
                const printData = {
                    id: todos[id].id,
                    todo: todos[id].todo,
                }
                return printsByType(printData, printType.Add);
            }

            const statePrint = () => {
                console.log(`현재상태 : todo: ${stateCounter.todo}개 doing: ${stateCounter.doing}개 done: ${stateCounter.done}개`)
            }
            const printsByType = (data, type) => {
                const filterPrint = data => data.forEach(todo => {
                    console.log(`${todo.id}, ${todo.todo}`)
                })
                const addPrint = data => {
                    console.log(`id: ${data.id} ${data.todo} 항목이 추가 되었습니다 `)
                    stateAddtoDo();
                    statePrint();
                }
                switch (type) {
                    case printType.Add:
                        return addPrint(data);
                    case printType.Filter:
                        return filterPrint(data);
                }

            }
            const enumCheckTodoState = (data, errMsg) => {
                if (!enumCheck(State, data)) throw new Error(errMsg)
                return;
            }
            const showTodo = filter => {
                enumCheckTodoState(filter, errMsg.addWrongState);
                const filteredTodos = Object.values(todos).filter(el => el.state === filter);
                printsByType(filteredTodos, printType.Filter);
            }
            const validIdCheck = id => {
                const idList = Object.keys(todos);
                return idList.filter(el => el === id).length !== 0
            }


            const checkSpendTime = (id) => {
                let startTime = todos[id].startTime.getTime();
                let doneTime = todos[id].doneTime.getTime();
                let spendTime = doneTime - startTime;
                console.log('spenTime', spendTime);


            }

            const updateTimer = (id, state) => {
                console.log('id', id, 'state', state);
                switch (state) {
                    case State.Doing:
                        return todos[id].startTime = new Date();

                    case State.Done:
                        {
                            todos[id].doneTime = new Date();
                            return todos[id].spendTimes = checkSpendTime(id);;
                        }

                }

            }
            const printTime = (id, state) => {
                switch (state) {
                    case State.Doing:
                        return todos[id].startTime
                    case State.Done:
                        return todos[id].spendTimes
                    default:
                        break;
                }
            }
            const updateTodo = (id, state) => {
                let beforeState = todos[id].state;
                enumCheckTodoState(state, errMsg.updateWrongState);
                if (notNumber(id)) throw Error(errMsg.notNumber)
                if (!validIdCheck(id)) throw Error(errMsg.notHaveThisId)
                todos[id].state = state;
                stateUpdate(beforeState, state);
                // updateTimer(id, state);
                // console.log('printTime', printTime(id, state));
                return statePrint();
            }
            switch (actions) {
                case Actions.Add:
                    return addTodo(second)
                case Actions.Show:
                    return showTodo(second)
                case Actions.Update:
                    return updateTodo(second, last);
            }
        }

        return compileOrder(order);
    }
    return controller
})();


command('add$자바스크립트공부');
command('add$ES6공부');

command('add$TIL 블로그 글 쓰기');
command('add$이전에 짠 것들 Refactoring하기');
command('add$Express 공부');
command('add$React 공부');
command('show$todo');

command('update$1$todo');
command('update$1$doing');
command('update$1$done');

// command('update$$done');
// command('show$done');