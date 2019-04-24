const Model = require('./model')

module.exports = function Controller(input) {
    const model = new Model();
    this.splitInput = () => {
        return input.split('$');
    }
    this.show = (status) => {
        const countEachStatus = model.getCountEachStatus();
        if(status === 'all') {
            console.log(`현재상태 : todo:${countEachStatus.todo}개, doing:${countEachStatus.doing}개, done:${countEachStatus.done}개`);
        }
    }
}