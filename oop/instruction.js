const originData = require('./todosdata.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;
const Utils = require('./utils.js');

function Instruction() {
	
}

Instruction.prototype = {

    show : (status) => {console.log(status, "this is show method");},
    add : () => {},
    delete : () => {},
    update :() => {}
};

module.exports = Instruction;