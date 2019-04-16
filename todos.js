const todos =  [{
    'name' : '자바스크립트1', 
    'tags' : ['programming', 'javascript'],
    'status' : 'todo',
    'id' : 12123123
},
{
    'name' : '자바스크립트2', 
    'tags' : ['programming', 'javascript'],
    'status' : 'doing',
    'id' : 12123123
},
{
    'name' : '자바스크립트3', 
    'tags' : ['programming', 'javascript'],
    'status' : 'doing',
    'id' : 12123123
},
{
    'name' : '자바스크립트5', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
},
{
    'name' : '자바스크립트6', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
},
{
    'name' : '자바스크립트7', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
},
{
    'name' : '자바스크립트8', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
}];




const show = (status) => {
if (status === 'all' ) {
    showAll();
} else {
    showTodo(status);
}
}

const list = {
'todo': [],
'doing': [],
'done': []
}

const showAll = () => { 
todos.forEach((todolist) => {
    if (todolist['status'] === 'todo') {
        list.todo.push(todolist['name']);
    } else if (todolist['status'] === 'doing') {
        list.doing.push(todolist['name']);
    } else {
        list.done.push(todolist['name']);
    }
})
console.log(`현재상태 : todo: ${list.todo.length}개, doing: ${list.doing.length}, done: ${list.done.length}`);
}

const showTodo = (status) => {
result = todos.filter(v => v.status === status).map(v => v.name);
console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
}



show('all');
show('done');