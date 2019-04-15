const todos = [{
    'name': '자바스크립트 공부하기',
    'tags': ['programming', 'javascript'],
    'status': 'todo',
    'id': 12123123
}, {
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

const getCountbyStatus = (obj, status) => obj.filter(v => v.status == status).length

const getTodos = () => {
    let str = ""
    let counts = {
        "todo": getCountbyStatus(todos, "todo"),
        "doing": getCountbyStatus(todos, "doing"),
        "done": getCountbyStatus(todos, "done"),
    }
    str += "현재상태 : " + Object.entries(counts).map(([k, v]) => `${k}: ${v}개`).join(", ")
    console.log(str)

}

const getTodosByStatus = (status) => {
    let str = ""
    let count = getCountbyStatus(todos, status)
    str += `${status}리스트 : 총 ${count}건 : ` + todos.filter(v => v.status == status).map(v => v.name).join(", ")
    console.log(str)
}

const STATUS_OBJ = {
    "all": getTodos,
    "todo": getTodosByStatus,
    "doing": getTodosByStatus,
    "done": getTodosByStatus
}

const show = (status) => {
    STATUS_OBJ[status](status)
}

const test = () => {
    show("all") // 현재상태 : todo: 2개, doing: 1개, done: 1개
    show("todo") // todo리스트 : 총 2건 : 자바스크립트 공부하기, nodejs 공부하기
    show("doing") // doing리스트 : 총 1건 : 그림 그리기
    show("done") // done리스트 : 총 1건 : 코드스쿼드 신청하기
}

test()