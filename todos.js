const _ = require("./lib.js")

const todos = [{
    'name': '자바스크립트 공부하기',
    'tags': ['programming', 'javascript'],
    'status': 'todo',
    'id': 12123123
},{
    'name': 'nodejs 공부하기',
    'tags': ['programming', 'javascript'],
    'status': 'todo',
    'id': 12123123
},
{
    'name': '그림 그리기',
    'tags': ['picture', 'favorite'],
    'status': 'doing',
    'id': 312323
},
{
    'name': '코드스쿼드 신청하기',
    'tags': ['codesquad', 'favorite'],
    'status': 'done',
    'id': 312320
}
]

const getTodos = () => {
    let counts = {
        "todo": getCountbyStatus(todos,"todo"),
        "doing": getCountbyStatus(todos,"doing"),
        "done": getCountbyStatus(todos,"done"),
    }
    let res = _.go(
        counts,
        Object.entries,
        _.map(([k, v]) => `${k}: ${v}개`),
        _.join(", "),
        _.concat("현재상태 : ")
    )
    console.log(res)
}

const getTodosByStatus = (status) => {
    let count = getCountbyStatus(todos, status)
    let res = _.go(
        todos,
        _.filter(v => v.status == status),
        _.map(v => v.name),
        _.join(", "),
        _.concat(`${status}리스트 : 총 ${count}건 : `)
    )

    console.log(res)
}

const getCountbyStatus = (obj, status) => {
    let cnt = _.go(
        obj,
        _.filter(v => v.status == status),
        _.count
    )
    return cnt
} 

const STATUS_OBJ = {
    "all" : getTodos,
    "todo" : getTodosByStatus,
    "doing" : getTodosByStatus,
    "done" : getTodosByStatus
}

const show = (obj) => {
    STATUS_OBJ[obj](obj)
}

const test = () => {
    show("all") // 현재상태 : todo: 2개, doing: 1개, done: 1개
    show("todo") // todo리스트 : 총 2건 : 자바스크립트 공부하기, nodejs 공부하기
    show("doing") // doing리스트 : 총 1건 : 그림 그리기
    show("done") // done리스트 : 총 1건 : 코드스쿼드 신청하기
}

test()