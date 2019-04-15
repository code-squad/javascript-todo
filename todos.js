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
    {s
        'name' : '자바스크립트4', 
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
    } else if ( status === 'todo') {
        showTodo();
    }
}

const showAll = function () {
    const list = [0, 0, 0]; 
    todos.forEach(function (todolist) {
        if (todolist['status'] === 'todo') {
            list[0] = list[0] + 1;
            console.log(list[0]);
        } else if (todolist['status'] === 'doing') {
            list[1] += 1;
        } else {
            list[2] += 1;
        }
    })
    console.log(list);
    console.log(`현재상태 : todo: ${list[0]}개, doing: ${list[1]}, done: ${list[2]}`);
}

const showTodo = function () {
    let list = 0;
    const donelist = [];
    for (let halil of todos) {
         if (halil['status'] === 'done') {
            list += 1;
        donelist.push(halil['name']);
    }
    }
    console.log(`todo리스트 :  총 ${list} 건 : ${donelist}`);
}


show('all');
show('todo');