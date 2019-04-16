const data = require('./todos')
const todos = data.todos;

const show = (array, status) => {
    switch (status) {
        case "all":
            const [todoCount, doingCount, doneCount] = getAllStatus(array);
            printListAll(todoCount, doingCount, doneCount)
            break;

        case "todo":
            const [todoCount_, todo_result] = getTodoName(array, status);
            printList(status, todoCount_, todo_result);
            break;

        case "doing":
            const [doingCount_, doing_result] = getTodoName(array, status)
            printList(status, doingCount_, doing_result);
            break;

        case "done":
            const [doneCount_, done_result] = getTodoName(array, status)
            printList(status, doneCount_, done_result);
            break;
    }
};

const getAllStatus = array => {
    let todoCount = 0
    let doingCount = 0
    let doneCount = 0
    array.forEach(function (obj) {
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

const getTodoName = (array, status) => {
    totalCount = 0;
    const done_result = array.filter(function (obj) {
        return obj.status === status;
    })
        .map(function (obj) {
            totalCount++;
            return obj.name
        })

    return [totalCount, done_result];

}


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