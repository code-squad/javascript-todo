const todos = require('./todosData');


const matchedData = [];


const checkValidId = function (idStr) {
    let isTrue = false;
    const nameAndIdList = [];
    todos.forEach((el, i) => {
        if (Number.isFinite(el['id']) && el['id'] === idStr) {
            isTrue = true;
            matchedData.push(el, i);
        }
        nameAndIdList.push([el['name'], el['id']]);
    });
    if (!isTrue) {
        console.log('invalid idNumber');
        console.log(`'${nameAndIdList.join('\' \'')}'`);
    }
    return isTrue;
}


const checkValidDo = function (doStr) {
    const doList = ['todo', 'doing', 'done'];
    const isTrue = doList.some((el) => el === doStr);
    if(!isTrue) {
        console.log('invalid order');
        console.log('show$<all, todo, doing, done>');
    }
    return isTrue;
}


module.exports = {
    checkValidId,
    checkValidDo,
    matchedData
}