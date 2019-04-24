const Model = require('./model')
const Utility = require('./utility')

module.exports = function Controller(input) {
    const model = new Model();
    const utility = new Utility();

    this.splitInput = () => {
        return input.split('$');
    }

    this.show = (status) => {
        const countEachStatus = model.getCountEachStatus();
        if(status === 'all') {
            console.log(`현재상태 : todo:${countEachStatus.todo}개, doing:${countEachStatus.doing}개, done:${countEachStatus.done}개`);
            return;
        }
        const listInStatus = model.getListInStatus(status);
        console.log(`${status}리스트 : ${listInStatus.length}건 : ${listInStatus}`);
    }

    this.add = (name, tag) => {
        const todoObj = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': utility.getRandomID()};
        model.addTodoList(todoObj);
        console.log(`${todoObj.name} 1개가 추가됐습니다. (id: ${todoObj.id})`);
        setTimeout( () => { this.show('all'); }, 1000);
    }
}