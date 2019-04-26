const todoList = require('./data.js');

const todoForm = function (name, tag, status, id) {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}

const findDataIdObj = (input) => {
    let target = todoList.filter(v => v["id"] === input);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);    
    return [targetIdx, targetName];
}

const makingID = () => {
    return Math.floor(Math.random() * 10000);
}

module.exports = {
    todoForm,
    findDataIdObj,
    makingID
}