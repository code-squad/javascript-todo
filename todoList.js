const todos = require('./todosData');

const showAll = function () {
    const theNumOf = status => todos.filter((el) => el['status'] === status).length;
    console.log(`현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`);
}
// showAll();
// 명령하세요 : show$all
// 현재상태 :  todo: 3개, doing:2개, done:4개
