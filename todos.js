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
        'id' : 312323
    },

    {
        'name' : 'IOS 공부하기', 
        'tags' : ['programming', 'swift'],
        'status' : 'doing',
        'id' : 2123
    },

    {
        'name' : 'Algorithm 공부하기', 
        'tags' : ['programming', 'c++'],
        'status' : 'done',
        'id' : 378
    },

    {
        'name' : '축구 하기', 
        'tags' : ['ball', 'favorite'],
        'status' : 'done',
        'id' : 92
    },

    {
        'name' : '웹 서핑하기', 
        'tags' : ['favorite'],
        'status' : 'done',
        'id' : 1000032
    },

    {
        'name' : '페어 프로그래밍 하기', 
        'tags' : ['team'],
        'status' : 'done',
        'id' : 31526
    },
];

const show = (type) => {
    const status = { 'todo': 0, 'doing': 0, 'done': 0 };

    // for ..of 문
    const list = [];
    for (const currentObj of todos) {
        if (currentObj['status'] === type) list.push(currentObj['name']);
        status[currentObj['status']]++;
    }

    // reduce 함수
    /*const list = todos.reduce( (arr, currentObj) => {
        if (currentObj['status'] === type) arr.push(currentObj['name']);
        status[currentObj['status']]++;
        return arr;
    } , [] );*/

    (type === 'all')
    ? console.log(`현재 상태 => todo : ${status['todo']}, doing : ${status['doing']}, done : ${status['done']}`)
    : console.log(`${type} 리스트 => 총 ${list.length}건 : `, list);
}

show('all');
show('todo');
show('done');
show('doing');