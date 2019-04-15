const todos = require('./todos');

const showsortedByDeadLine = function (filterArg) {

    const printTodos = function (_array) {
        const sortedDeadline = _array.map((element) => ({ deadline: element.deadline, id: element.id }))
            .sort((a, b) => a.deadline > b.deadline ? 1 : -1);

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

    const getTodoMap = function (_array, checkKey) {
        // 리듀스로 구현
        const middleObj = _array.reduce((acc, curr) => {
            if (acc.hasOwnProperty(curr.checkKey)) {
                acc[curr.status]++;
            } else {
                acc[curr.status] = 1;
            }
            return acc;
        }, {});
        return new Map(Object.entries(middleObj))
    }

    const showTodoAll = function (_array) {
        const todoMap = getTodoMap(_array, "status");
        // Map 객체의 keys()는 Iterator를 반환. Array.from(Iterator)는 Array를 반환.
        // Object.keys(obj)는...?
        const showMessageArray = Array.from(todoMap.keys())
            .reduce((acc, curr) => {
                acc.push(`${curr}는 ${todoMap.get(curr)}개`);
                return acc;
            }, []);
        console.log(showMessageArray.join(", "));
    }

    const showFilteredTodo = function (_array, filterArg) {
        // 필터링된 Array는 Map이 필요 없다.
        const filteredArray = _array.filter(v => v.status === filterArg);
        const showMessageArray = filteredArray
            .reduce((acc, curr) => {
                acc.push(curr['name']); // name은 키워드와 혼동되므로 문자열로 처리 하자.
                return acc;
            }, []);
        console.log(`${filterArg} - ${filteredArray.length}개 : ` + showMessageArray.join(", "));
    }

    if (filterArg === "all") {
        showTodoAll(todos);
    } else {
        showFilteredTodo(todos, filterArg);
    }
}
show('all');
console.log("\n");
show("don't do");
show("done");
show('todo');
show('smoking');