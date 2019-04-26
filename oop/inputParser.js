module.exports = class InputParser {
    constructor(order, data) {
        this.data = data
        this.sepOrder = order.split('$');
        this.firstPara = this.sepOrder[0];
        this.secondPara = this.sepOrder[1];
        this.thirdPara = this.sepOrder[2];
    }
    show() { return [this.secondPara]}
    add() { return [this.secondPara, this.thirdPara] }
    delete() { return [this.secondPara] }
    update() { return [this.secondPara, this.thirdPara] }
}