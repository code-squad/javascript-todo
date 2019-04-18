const todos = require('./todosData');
const utils = require('./utils');


const showAll = function () {
    const theNumOf = status => todos.filter((el) => el['status'] === status).length;
    console.log(`현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`);
}
// showAll();
// 명령하세요 : show$all
// 현재상태 :  todo: 3개, doing:2개, done:4개


const showEachData = function (order) {
    const eachOrder = order.slice(5);
    if (utils.checkValidDo(eachOrder)) {
        const nameAndIdArr = todos
            .filter((el) => el['status'] === eachOrder)
            .map((el) => [el['name'], el['id']]);
        console.log(`${eachOrder}리스트 총 ${nameAndIdArr.length}건 : '${nameAndIdArr.join('\' \'')}'`);
    }
}
// console.log(showEachData('show$doings'))
// 명령하세요 : show$todo
// todo리스트 :  총3건 : ' 자바스크립트 공부하기, 1822번' , 'iOS공부하기, 9933번'


const addData = function (order) {
    const objToAdd = {};
    objToAdd['name'] = order.match(/(?<=\$)(\d|\D)*(?=\$)/)[0];
    objToAdd['tag'] = order.match(/(?<=\[|\'|\")(\d|\D)*(?=\"|\'|\])/)[0];
    objToAdd['status'] = 'todo';
    objToAdd['id'] = Math.floor(Math.random() * 100000);
    todos.push(objToAdd);
    console.log(`${objToAdd['name']} 1개가 추가됐습니다.(id : ${objToAdd['id']})`);
    setTimeout(() => showAll(), 1000);
}
// console.log(addData('add$'))
// 명령하세요 : add$sleep$["favorite"]
// 공부하기 1개가 추가됐습니다.(id : 7788)
// 현재상태 :  todo: 3개, doing:2개, done:4개


const deleteData = function (order) {
    const idToDelete = Number(order.match(/(?<=\$)[0-9]*/)[0]);
    if (utils.checkValidId(idToDelete)) {
        console.log(`${utils.matchedData[0]['name']}(${utils.matchedData[0]['status']})가 목록에서 삭제됐습니다.`);
        todos.splice(utils.matchedData[1], 1);
        setTimeout(() => showAll(), 1000);
    }
}

// console.log(deleteData('delete$43532'))
// 명령하세요 : delete$7788  //id번호
// 공부하기 todo가 목록에서 삭제됐습니다
// 현재상태 :  todo: 3개, doing:2개, done:4개


const updateData = function (order) {
    const idToUpdate = Number(order.match(/(?<=\$)[0-9]*(?=\$)/)[0]);
    const statusToUpdate = order.match(/(?<=\d\$)[a-z]*/)[0];
    if (utils.checkValidId(idToUpdate) && utils.checkValidDo(statusToUpdate))
        setTimeout(() => {
            console.log(`${utils.matchedData[0]['name']}가 ${utils.matchedData[0]['status']}에서 ${statusToUpdate}으로 상태가 변경됐습니다.`);
            utils.matchedData[0]['status'] = statusToUpdate;
            setTimeout(() => showAll(), 1000);
        }, 3000);
}
// console.log(updateData('update$34536$done'))
// 명령하세요 : update$7788$doing
// 공부하기가 doing으로 상태가 변경됐습니다
// 현재상태 :  todo: 3개, doing:2개, done:4개


module.exports = {
    showAll,
    showEachData,
    addData,
    deleteData,
    updateData
}