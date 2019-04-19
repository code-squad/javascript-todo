const todos = require('./todosData');
const utils = require('./utils');


const readline = require('readline');
const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.setPrompt('명령하세요 : ');
r.prompt();
r.on('line', function (line) {
    if (line === 'q') {
        r.close();
    }
    application(line);
});
r.on('close', function () {
    process.exit();
});


function application(line) {


    const showAll = function () {
        const theNumOf = status => todos.filter((el) => el['status'] === status).length;
        console.log(`현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`);
        r.prompt();
    }
    // showAll();
    // 명령하세요 : show$all
    // 현재상태 :  todo: 3개, doing:2개, done:4개


    const showEachData = function (order) {
        const status = order.match(/(?<=show\$)(todo|doing|done)$/);
        if (!utils.isValidStatus(status)) return r.prompt();

        const nameAndIdArr = todos
            .filter((el) => el['status'] === status[0])
            .map((el) => [el['name'], el['id']+'번']);
        console.log(`${status[0]}리스트 총 ${nameAndIdArr.length}건 : '${nameAndIdArr.join('\' \'')}'`);
        r.prompt();
    }
    // showEachData('show$doing')
    // 명령하세요 : show$todo
    // todo리스트 :  총3건 : ' 자바스크립트 공부하기, 1822번' , 'iOS공부하기, 9933번'


    const addData = function (order) {
        const name = order.match(/(?<=add\$)\D*(?=\$)/);
        const tag = order.match(/(?<=\[\")[a-z]*(?=\"\])/i);
        if (!utils.isValidName(name) || !utils.isValidTag(tag)) return r.prompt();

        const objToAdd = {};
        objToAdd['name'] = name[0];
        objToAdd['tag'] = tag[0];
        objToAdd['status'] = 'todo';
        objToAdd['id'] = utils.makeRanNum(5,todos);
        todos.push(objToAdd);
        console.log(`${objToAdd['name']} 1개가 추가됐습니다.(id : ${objToAdd['id']})`);
        setTimeout(() => showAll(), 1000);
    }
    // console.log(addData('add$sleep$["favorite]'))
    // 명령하세요 : add$sleep$["favorite"]
    // 공부하기 1개가 추가됐습니다.(id : 7788)
    // 현재상태 :  todo: 3개, doing:2개, done:4개


    const deleteData = function (order) {
        const id = order.match(/(?<=delete\$)\d{5}$/);
        if (!utils.isValidId(id)) return r.prompt();

        todos.some((el, i) => {
            if (el['id'] === Number(id[0])) {
                console.log(`${el['name']}(${el['status']})가 목록에서 삭제됐습니다.`);
                todos.splice(i, 1);
                setTimeout(() => showAll(), 1000);
                return true;
            } else if (i === todos.length - 1) {
                console.log('there is no such idNumber');
                r.prompt();
            }
        });
    }
    // console.log(deleteData('delete$34536'))
    // 명령하세요 : delete$7788  //id번호
    // 공부하기 todo가 목록에서 삭제됐습니다
    // 현재상태 :  todo: 3개, doing:2개, done:4개


    const updateData = function (order) {
        const id = order.match(/(?<=update\$)\d{5}(?=\$)/);
        const status = order.match(/(?<=\d{5}\$)(todo|doing|done)$/g);
        if (!utils.isValidId(id) || !utils.isValidStatus(status)) return r.prompt();

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
                r.prompt();
            }
        });
    }
    // console.log(updateData('update$12348$doing'))
    // 명령하세요 : update$7788$doing
    // 공부하기가 doing으로 상태가 변경됐습니다
    // 현재상태 :  todo: 3개, doing:2개, done:4개


    if (line === 'show$all') showAll();
    else if (line.slice(0, 4) === 'show') showEachData(line);
    else if (line.slice(0, 3) === 'add') addData(line);
    else if (line.slice(0, 6) === 'delete') deleteData(line);
    else if (line.slice(0, 6) === 'update') updateData(line);
    else {
        console.log('--invalid order');
        console.log('show$all\nshow$<status>\nadd$<name>$<["tag"]\ndelete$<id>\nupdate$<id>$<status>');
    }
}