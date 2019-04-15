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
];

//각각의 status 해당하는 빈 array
let statusObject = { 
	'todo': [],
	'doing': [],
	'done': []
};

//초기 statusObject데이터 생성 함수
const init_data = (todos) => { //DB 객체의 데이터를 불러옴
    //FOR 전체 DB 객체 탐색
    todos.forEach((item) => {
        if (item.status === 'todo') { //status가 todo일 때
            statusObject.todo.push(item.name);
        } else if (item.status === 'doing') { //status가 doing일 때
            statusObject.doing.push(item.name);
        } else { //status가 done일 때
            statusObject.done.push(item.name);
        }
    });
    // 초기화 완료 출력
    console.log("Init Completed!");
};

//input을 받아 출력을 위한 함수
const show = (input) => {
    if (input === 'all') { // 입력이 all일 때
        console.log(`현재상태 :  todo: ${statusObject.todo.length}개, doing: ${statusObject.doing.length}개, done: ${statusObject.done.length}개`);
    } else if ('todo doing done'.includes(input)) { // input이 status일 때
        let statusNameList = statusObject[input].join(', ');
        console.log(`${input}리스트 :  총${statusObject[input].length}건 : ${statusNameList}`)
    } else{ //input이 다른 입력일 때
        throw new Error('올바르지 않은 입력입니다.');
    };
};

init_data(todos);

show("all");
show("todo");
show("doing");
show('dfdsfsdf');