const database = require('./database.json');

const showsortedByDeadLine = function (filterArg) {

    const printdatabase = function (_array) {
        const sortedDeadline = _array.map((element) => ({ deadline: element.deadline, id: element.id }))
            .sort((a, b) => a.deadline > b.deadline ? 1 : -1);

        sortedDeadline.forEach(element => {
            console.log(database.filter(el => el.id === element.id));
        })
    }
    if (filterArg === "all") {
        printdatabase(database);
    } else {
        printdatabase(database.filter(e => e.status === filterArg));
    }
}

const show = function (filterProperty,filterValue) {

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
            accum.push(`${cur} ${todoMap.get(cur)}`);
            return accum
        }
        ,[]);
        console.log("현재 " + showMessageArray.join(", "));
    }

    const showFilteredTodo = function (_array, filterProperty, filterValue) {
        const _filteredArray = _array.filter(v=>v[filterProperty] == filterValue);
        const totalCount = _filteredArray.length;
        const _filteredObjNameString = _filteredArray.map(el=>el.name).join(", ");
        console.log(`${filterProperty}가 ${filterValue}인 것은 총 ${totalCount}개: ${_filteredObjNameString}`);
    }

    if (filterProperty === "all") {
        showTodoAll(database);
    } else {
        showFilteredTodo(database, filterProperty, filterValue);
    }
}
exports.show = show;
exports.database = database;