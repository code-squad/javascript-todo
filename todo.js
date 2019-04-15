const todos = [
    {
        name: '지구정복하기',
        category: 'mad science',
        status: "don't do",
        id: 1,
        deadline: "2025-01-01"
    },
    {
        name: '구글 입사',
        category: 'mission impossible',
        status: 'doing',
        id: 2,
        deadline: "2080-12-31"
    },
    {
        name: '크롱과 뽀로로보기',
        category: 'chakanil',
        status: 'todo',
        id: 3,
        deadline: '2019-04-17'
    },
    {
        name: '자바스크립트 공부하기',
        category: 'study',
        status: 'done',
        id: 4,
        deadline: '2019-04-01'
    },
    {
        name: '5만원 다쓰기',
        category: "현질",
        status: 'doing',
        id: 5,
        deadline: "2019-04-20"
    },
    {
        name: '피자먹기',
        category: "become a pig",
        status: 'todo',
        id: 6,
        deadline: "2019-06-01"
    },
    {
        name: '창업하기',
        category: '엄마한테 혼나기',
        status: 'todo',
        id: 7,
        deadline: '2021-01-01'

    }
]

const preshow = function (filterArg) {

    const printTodos = function (_array) {
        const sortedDeadline = _array.map((element) => ({ deadline: element.deadline, id: element.id })).sort((a, b) => a.deadline > b.deadline ? 1 : -1);
        sortedDeadline.forEach(element => {
            console.log(todos.filter(el => el.id === element.id));
        })
    }
    if (filterArg === "all") {
        printTodos(todos);
    } else {
        printTodos(todos.filter(e => e.status === filterArg));
    }
}



const show = function (filterArg) {
    const getTodoMap = function (_array){
        const todoMap = new Map();
        _array.forEach(element => {
            if (todoMap.has(element.status)){
                todoMap.set(element.status, todoMap.get(element.status)+1);
            }else{
                todoMap.set(element.status, 1);
            }
        });
        return todoMap;
    }

    const showTodoAll = function (_array) {
        const todoMap = getTodoMap(_array);
        todoMap.forEach((value,key) => {
            console.log(`${key}는 ${value}임.`);
        })
    }

    const showFilteredTodo = function (_array,filterArg) {
        const _filteredArray = _array.filter(v=>v.status === filterArg);
        const todoMap = getTodoMap(_filteredArray);
        let totalCount = 0;
        todoMap.forEach(function (value, key) {
            totalCount += value;
        });
        console.log(`${filterArg}는 총 ${totalCount}개:`);
        _filteredArray.forEach(element => console.log(element.name));
    }

    if (filterArg === "all") {
        showTodoAll(todos);
    } else {
        showFilteredTodo(todos,filterArg);
    }
}
show('all');
console.log("\n");
show("don't do");
show("done");
show('todo');