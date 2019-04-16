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

    const getTodoMap = function (_array) {
        // 리듀스로 구현
        const middleObj = _array.reduce((accum,curr)=>{
            accum[curr.status] = ++accum[curr.status] || 1;
            return accum;
        },{})
        return new Map(Object.entries(middleObj))
    }

    const showTodoAll = function (_array) {
        const todoMap = getTodoMap(_array);
        // Map 객체의 keys()는 Iterator를 반환. Array.from(Iterator)는 Array를 반환.
        // Object.keys(obj)는...?
        const showMessageArray = [...todoMap.keys()].reduce((accum,cur)=>{
            accum.push(`${cur}는${todoMap.get(cur)}임`);
            return accum
        }
        ,[]);
        console.log(showMessageArray.join(", "));
    }

    const showFilteredTodo = function (_array, filterArg) {
        const _filteredArray = _array.filter(v=>v.status === filterArg);
        const totalCount = _filteredArray.length;
        const _filteredObjNameString = _filteredArray.map(el=>el.name).join(", ");
        console.log(`${filterArg}는 총 ${totalCount}개: ${_filteredObjNameString}`);
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