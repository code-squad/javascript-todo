//todos.js

const todos =  [ 
    {
        'name' : '자바스크립트 공부하기', 
        'tags' : ['programming', 'javascript'],
        'status' : 'todo',
        'id' : 12123123
    },
                    {
        'name' : ' 그림 그리기', 
        'tags' : ['picture', 'favorite'],
        'status' : 'doing',
        'id' : 312323
    }
    // ....
];

// const show = (obj) => {
// ...
// }

const res = {
    
};
function init(todos){
    for( obj of todos) {
       if(res[obj.status] === undefined) {
           res[obj.status] = [];
           res[obj.status].push(obj);
           continue;
       } 
        res[obj.status].push(obj);      
    } 
    return res;
}
init(todos);

function show(status){
    if (status === "all") {
        for (key in res ) {
            console.log( key, ": ", res[key].length)
        }
    }
    if (!(res[status]===undefined)) {
        console.log(res[status].map(v => v.name).join(", "))
    }
}

show("all");
show("todo")
// show("all");
// show("todo");