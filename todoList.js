const todos = require('./todosData');


const showAll = function () {
    const theNumOf = status => todos.filter((el) => el['status'] === status).length;
    console.log(`현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`);
}
// showAll();
// 명령하세요 : show$all
// 현재상태 :  todo: 3개, doing:2개, done:4개


const showEachData = function (order) {
    const nameAndIdArr = todos
        .filter((el) => el['status'] === order.slice(5))
        .map((el) => [el['name'], el['id']]);
    console.log(`${order.slice(5)}리스트 총 ${nameAndIdArr.length}건 : '${nameAndIdArr.join('\' \'')}'`);
}
// console.log(showEachData('show$doing'))
// 명령하세요 : show$todo
// todo리스트 :  총3건 : ' 자바스크립트 공부하기, 1822번' , 'iOS공부하기, 9933번'