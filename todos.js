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

const process = (query) => {
    const status = { 'todo': 0, 'doing': 0, 'done': 0 };
    const resultList = [];
    for (const currentObj of todos) {
        if (currentObj['status'] === query) 
            resultList.push(currentObj['name']);
        
        status[currentObj['status']]++;
    }
    return [status, resultList]; 
}


const show = (query) => {
    const[status, resultList] = process(query);
    if (query === 'all') {
        console.log(`현재 상태 => todo : ${status['todo']}, doing : ${status['doing']}, done : ${status['done']}`);
    } else {
        console.log(`${query} 리스트 => 총 ${resultList.length}건 : `, resultList);
    }
}

show('all');
show('todo');
show('done');
show('doing');