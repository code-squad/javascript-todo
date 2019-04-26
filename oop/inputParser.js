module.exports = class InputParser {
    constructor(order) {
        this.splitedOrder = order.split('$');
    }
    excute(todos) {
        if (this.splitedOrder[0] === 'show' || this.splitedOrder[0] === 'delete') {
            return todos[this.splitedOrder[0]](this.splitedOrder[1]);
        } else {
            return todos[this.splitedOrder[0]](this.splitedOrder[1], this.splitedOrder[2]);
        }
    }
}