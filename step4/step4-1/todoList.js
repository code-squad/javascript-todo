const data = require('./todos')
const todos = data.todos;

const show = (todoList, status) => {
        if (status === `all`){
            const [todoCount, doingCount, doneCount] = getAllStatus(todoList);
            printListAll(todoCount, doingCount, doneCount)
            return
        }

            const [todoCount_, todo_result] = getTodoName(todoList, status);
            printList(status, todoCount_, todo_result);

    };

const getAllStatus = todoList => {
    let todoCount = 0
    let doingCount = 0
    let doneCount = 0
    todoList.forEach(function (obj) {
        if (obj.status === "todo") {
            todoCount++;
        }
        if (obj.status === "doing") {
            doingCount++;
        }
        if (obj.status === "done") {
            doneCount++;
        }
    })
    return [todoCount, doingCount, doneCount]
};

const getTodoName = (todoList, status) => {
    totalCount = 0;
    const done_result = todoList.filter(function (obj) {
        return obj.status === status;
    })
        .map(function (obj) {
            totalCount++;
            return obj.name
        })

    return [totalCount, done_result];

}


const getID = (todos) => {
    const r = Math.floor(Math.random()*10000) + 1;
    const checkDuplicatedID = todos.filter(list => {
        return list.id === r;
    });
    if(checkDuplicatedID.length > 0) getID(todos);

    return r;
}

const addList = (input) =>{
    const input_arr = input.split('$');
    const id = getID(todos);

    const newTodo = {
        'name' : input_arr[1],
        'tag' : input_arr[2],
        'status' : "todo",
        'id' : id
    };
    todos.push(newTodo);
}

addList('add$sleep$["favorite"]');
// console.log(todos);


const deleteList = (input) =>{
    const input_arr = input.split('$');
    const checkedList = todos.filter(list => {
        // console.log(list.id)
        return list.id == input_arr[1]
    })

    if(checkedList.length === 0){
        throw Error("존재하지 않는 id 입니다.")
    }
    
    const willDeleteList = checkedList[0];
    const deletedListStatus = willDeleteList.status;
    const matchedIndex= todos.indexOf(willDeleteList)
    todos.splice(matchedIndex,1);
    return deletedListStatus
}

console.log(deleteList('delete$312323'))


const printListAll = (todoCount, doingCount, doneCount) => {
    const result = `현재상태 : todo: ${todoCount}개, doing: ${doingCount}개, done: ${doneCount}개`;
    console.log(result)
}

const printList = (status, Count, list) => {
    const result = `${status}리스트 : 총 ${Count}개: ${list.join(', ')}`;
    console.log(result);
}

show(todos, "all");
show(todos, "todo");
show(todos, "doing");
show(todos, "done");