module.exports = class InputParser {
    constructor(order, data) {
        this.data = data
        this.sepOrder = order.split('$');
        this.first = this.sepOrder[0];
        this.second = this.sepOrder[1];
        this.third = this.sepOrder[2];
        this.dollor = order.match(/\$/g).length;
    }
    show() { return [this.second]}
    add() { return [this.second, this.third] }
    delete() { return [this.second] }
    update() { return [this.second, this.third] }
}