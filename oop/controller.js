const Model = require('./model')
const Utility = require('./utility')
const ErrorHandler = require('./errorHandler')

module.exports = function Controller() {
    const model = new Model();
    const utility = new Utility();
    const errorHandler = new ErrorHandler();
    
    this.splitInput = (inputArray) => {
        return inputArray.split('$');
    }

    this.instruct = (input) => {
        const inputArray = this.splitInput(input);
        if (inputArray === 1) {
            errorHandler.showUsage();
            return;
        }

        const command = inputArray[0];
        switch(command) {
            case 'show' :
                const statusShow = inputArray[1];
                this.show(statusShow);
                break;
            case 'add' :
                const name = inputArray[1];
                const tag = inputArray[2];
                this.add(name, tag);
                break;
            case 'delete' :
                const idDelete = inputArray[1];
                this.delete(idDelete);
                break;
            case 'update' :
                const idUpdate = inputArray[1];
                const statusUpdate = inputArray[2];
                this.update(idUpdate, statusUpdate);
                break;
        }
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
        console.log(tag);
        const todoObj = {'name': name, 'status': 'todo', 'tags': tag.match(/[a-z0-9]+/g), 'id': utility.getRandomID()};
        model.addTodoObject(todoObj);
        console.log(`${todoObj.name} 1개가 추가됐습니다. (id: ${todoObj.id})`);
        setTimeout( () => { this.show('all'); }, 1000);
    }

    this.delete = (id) => {
        const objToDelete = model.deleteTodoObject(id);
        if(!objToDelete) {
            errorHandler.showNotExistIdErrorMessage();
            return;
        }
        console.log(`${objToDelete.name}이 ${objToDelete.status}가 목록에서 삭제됐습니다.`);
        setTimeout( () => { this.show('all'); }, 1000);
    }

    this.update = (id, status) => {
        const objToUpdate = model.updateTodoObject(id, status);
        if(!objToUpdate) {
            errorHandler.showNotExistIdErrorMessage();
            return;
        }
        setTimeout(() => {
            console.log(`${objToUpdate.name}이 ${objToUpdate.status}가 목록에서 삭제됐습니다.`);
            setTimeout( () => { this.show('all'); }, 1000);
        }, 3000)
    }
}