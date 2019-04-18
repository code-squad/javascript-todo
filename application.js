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
    const status = order.match(/(?<=\d\$)(todo|doing|done)*/);
    if (!utils.isValidStatus(status)) return false;

    const nameAndIdArr = todos
        .filter((el) => el['status'] === eachOrder)
        .map((el) => [el['name'], el['id']]);
    console.log(`${eachOrder}리스트 총 ${nameAndIdArr.length}건 : '${nameAndIdArr.join('\' \'')}'`);
}
// console.log(showEachData('show$doings'))
// 명령하세요 : show$todo
// todo리스트 :  총3건 : ' 자바스크립트 공부하기, 1822번' , 'iOS공부하기, 9933번'


const addData = function (order) {
    const name = order.match(/(?<=\$)\D*(?=\$)/);
    const tag = order.match(/(?<=\[\")[a-z]*(?=\"\])/i);
    if (!utils.isValidName(name)) return false;
    if (!utils.isValidTag(tag)) return false;

    const objToAdd = {};
    objToAdd['name'] = name[0];
        objToAdd['tag'] = tag[0];
        objToAdd['status'] = 'todo';
    objToAdd['id'] = Math.floor(Math.random() * 100000);
    todos.push(objToAdd);
    console.log(`${objToAdd['name']} 1개가 추가됐습니다.(id : ${objToAdd['id']})`);
    setTimeout(() => showAll(), 1000);
}
// console.log(addData('add$sleep$["favorite]'))
// 명령하세요 : add$sleep$["favorite"]
// 공부하기 1개가 추가됐습니다.(id : 7788)
// 현재상태 :  todo: 3개, doing:2개, done:4개


const deleteData = function (order) {
    const id = order.match(/(?<=\$)\d{5}/);
    if (!utils.isValidId(id)) return false;

    todos.some((el, i) => {
        if (el['id'] === Number(id[0])) {
            console.log(`${el['name']}(${el['status']})가 목록에서 삭제됐습니다.`);
            todos.splice(i, 1);
            setTimeout(() => showAll(), 1000);
            return true;
        } else if (i === todos.length - 1) {
            console.log('there is no such idNumber');
        }
    });
}
// console.log(deleteData('delete$34536'))
// 명령하세요 : delete$7788  //id번호
// 공부하기 todo가 목록에서 삭제됐습니다
// 현재상태 :  todo: 3개, doing:2개, done:4개


const updateData = function (order) {
    const id = order.match(/(?<=\$)\d{5}(?=\$)/);
    const status = order.match(/(?<=\d\$)(todo|doing|done)*/);
    if (!utils.isValidId(id)) return false;
    if (!utils.isValidStatus(status)) return false;

    todos.some((el, i) => {
        if (el['id'] === Number(id[0])) {
            setTimeout(() => {
                console.log(`${el['name']}가 ${el['status']}에서 ${status[0]}으로 상태가 변경됐습니다.`);
                el['status'] = status[0];
                setTimeout(() => showAll(), 1000);
            }, 3000);
            return true;
        } else if (i === todos.length - 1) {
            console.log('there is no such idNumber');
        }
    })
}
// console.log(updateData('update$12348$doing'))
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