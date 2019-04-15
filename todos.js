const todos =  [ 
    {
        'name' : '자바스크립트 공부하기', 
        'tags' : ['programming', 'javascript'],
        'status' : 'todo',
        'id' : 12123123
    },
    {
        'name' : '그림 그리기', 
        'tags' : ['picture', 'favorite'],
        'status' : 'doing',
        'id' : 35435345
    },
    {
        'name' : '꽃구경하기', 
        'tags' : ['flower', 'favorite'],
        'status' : 'done',
        'id' : 7657
    },
    {
        'name' : '저녁식사', 
        'tags' : ['dinner', 'food'],
        'status' : 'todo',
        'id' : 097989
    },
    {
        'name' : '커피마시기', 
        'tags' : ['coffee', 'favorite'],
        'status' : 'doing',
        'id' : 65464
    }
];

const newTodoList = {'todo' : [], 'doing' : [], 'done' : []};

const makeNewTodoList = function(){
    todos.forEach(function(todo){
        let key = todo.status;
        let value = todo.name;
        newTodoList[key].push(value);
    })
};