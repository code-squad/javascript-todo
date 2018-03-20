// reg = new RegExp("^[\\w\\-]+(\\.[\\w\\-_]+)*@[\\w\\-]+(\\.[\\w\\-]+)*(\\.[a-zA-Z]{2,3})$", "gi");
// var re = new RegExp("ab+c");
// 정규표현식 없이 .split() 구현 or 정규표현식! 
// let result = target.match(r)

const command = (function(){
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


    const controller = function(order){
        const todos = {};
        let id = 0;

        const compileOrder = function(target){
            
            const [first,second,last] = target.split('$');
            
            const isActions = actions => !!(actions === Actions.Add| Actions.Show| Actions.Update )
            
            if(!isActions(first)) throw new Error('명령어는 add show update 중 하나입니다. ex) add$공부')
            
            const actions = first;

            const addTask = task => {
                id +=1
                todos[id] = {
                    task,
                    state: State.Todo  
                }
                let idList = Object.keys(todos);
                let states = stateCheck()
                console.log(`id: ${idList[idList.length-1]} ${todos[id].task} 항목이 추가 되었습니다 `)
                console.log(`현재상태 : todo: ${states.todo}개 doing: ${states.doing}개 todo: ${states.done}개`)
            }
            const stateCheck = () => {
                const stateCounter = {
                    todo: 0,
                    doing: 0,
                    done: 0,
                }
                for(key in todos){
                    switch(todos[key].state){
                        case State.Todo: {
                            stateCounter.todo +=1;
                            break;
                        } 
                        case State.Doing:{
                            stateCounter.doing +=1;
                            break;
                        } 
                        case State.Done: {
                            stateCounter.done +=1;
                            break;
                        }
                        default: break; 
                    }
                    return stateCounter;
                }
            }
            switch(actions){
                case Actions.Add: return addTask(second)
            }
        }
    
        return compileOrder(order);

    }
    return controller
})();

command('add$자바스크립트공부');