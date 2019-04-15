const todos = require('./todosData');



// 첫번째 설계와 코드구현
function show(order) {
    if (order === 'all') {
        const theNumOf = status => todos.filter((el) => el['status'] === status).length
        return `현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`
    }else {
        const todoList = todos.reduce((acc, cur) => {
            if (cur['status'] === 'todo') acc.push(cur['name']);
            return acc;
        }, [])
        return `총 ${todoList.length}건 ${todoList.join(', ')}`
    }
}
console.log(show('all'))





// 두번째 설계와 코드구현
function show(order) {
    const countNum = { 'todo': 0, 'doing': 0, 'done': 0 };
    const statusList = todos.reduce((acc, cur) => {
        if (cur['status'] === order) { acc.push(cur['name']) };
        countNum[cur['status']]++;
        return acc;
    }, [])

    order === 'all' ?
        console.log(`현재상태 : todo ${countNum['todo']}개, doing ${countNum['doing']}개, done ${countNum['done']}개`) :
        console.log(`총 ${statusList.length}건 ${statusList.join(', ')}`)
}
show('all');
show('todo');
show('doing');
show('done');
