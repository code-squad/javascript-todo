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


const addData = function (order) {
    const objToAdd = {};
    objToAdd['name'] = order.match(/(?<=\$)\D*(?=\$)/)[0];
    objToAdd['tag'] = order.match(/(?<=\'|\")[a-z]*(?=\'|\")/)[0];
    objToAdd['status'] = 'todo';
    objToAdd['id'] = Math.floor(Math.random() * 100000);
    todos.push(objToAdd);
    console.log(`${objToAdd['name']} 1개가 추가됐습니다.(id : ${objToAdd['id']})`)
    setTimeout(() => showAll(), 1000);
}
// console.log(addData('add$운동하기$["favorite"]'))
// 명령하세요 : add$sleep$["favorite"]
// 공부하기 1개가 추가됐습니다.(id : 7788)
// 현재상태 :  todo: 3개, doing:2개, done:4개


const deleteData = function (order) {
    const idToDelete = Number(order.match(/(?<=\$)[0-9]*/)[0]);
    todos.forEach((el, i) => {
        if (el['id'] === idToDelete) {
            console.log(`${el['name']}(${el['status']})가 목록에서 삭제됐습니다.`);
            todos.splice(i, 1);
        }
    });
    setTimeout(() => showAll(), 1000);
}
// console.log(deleteData('delete$43532'))
// 명령하세요 : delete$7788  //id번호
// 공부하기 todo가 목록에서 삭제됐습니다
// 현재상태 :  todo: 3개, doing:2개, done:4개


const updateData = function (order) {
    const idToUpdate = Number(order.match(/(?<=\$)[0-9]*(?=\$)/)[0]);
    const statusToUpdate = order.match(/(?<=\d\$)[a-z]*/)[0];
    todos.forEach((el) => {
        if (el['id'] === idToUpdate) {
            setTimeout(() => {
                console.log(`${el['name']}가 ${el['status']}에서 ${statusToUpdate}으로 상태가 변경됐습니다.`);
                el['status'] = statusToUpdate;
                setTimeout(() => showAll(), 1000);
            }, 3000);
        }
    })
}
// console.log(updateData('update$34536$done'))
// 명령하세요 : update$7788$doing
// 공부하기가 doing으로 상태가 변경됐습니다
// 현재상태 :  todo: 3개, doing:2개, done:4개