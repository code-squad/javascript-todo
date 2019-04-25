function Instruction() {
	
}

Instruction.prototype = {

    show : (status) => {console.log(status, "this is show method");},
    add : () => {},
    delete : () => {},
    update :() => {}
};

module.exports = Instruction;