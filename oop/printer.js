
module.exports = function Printer() {
    this.printMessageShowAll = (countEachStatus) => {
        console.log(`현재상태 : todo:${countEachStatus.todo}개, doing:${countEachStatus.doing}개, done:${countEachStatus.done}개`);
    }

    this.printMessageShowStatus = (status, listInStatus) => {
        console.log(`${status}리스트 : ${listInStatus.length}건 : ${listInStatus}`);
    }

    this.printMessageAdd = (objToAdd) => {
        console.log(`${objToAdd.name} 1개가 추가됐습니다. (id: ${objToAdd.id})`);
    }

    this.printMessageDelete = (objToDelete) => {
        console.log(`${objToDelete.name}이 ${objToDelete.status}가 목록에서 삭제됐습니다.`);
    }

    this.printMessageUpdate = (objToUpdate) => {
        console.log(`${objToUpdate.name}이 ${objToUpdate.status}가 목록에서 삭제됐습니다.`);
    }

    this.printUsage = () => {
        console.log('[command]$[arg1]$[arg2]');
    }

    this.printNotExistErrorMessage = () => {
        console.log('존재하지 않는 ID입니다.');
    }

    this.printSameStatusErrorMessage = () => {
        console.log('이미 그 상태입니다.');
    }
}