const Printer = {
    printShowAllMessage(countEachStatus) {
        console.log(`현재상태 : todo:${countEachStatus.todo}개, doing:${countEachStatus.doing}개, done:${countEachStatus.done}개`);
    },
    
    printShowStatusMessage(status, listInStatus) {
        console.log(`${status}리스트 : ${listInStatus.length}건 : ${listInStatus}`);
    },
    
    printAddMessage(objToAdd) {
        console.log(`${objToAdd.name} 1개가 추가됐습니다. (id: ${objToAdd.id})`);
    },
    
    printDeleteMessage(objToDelete) {
        console.log(`${objToDelete.name}이 ${objToDelete.status}가 목록에서 삭제됐습니다.`);
    },
    
    printUpdateMessage(objToUpdate) {
        console.log(`${objToUpdate.name}이 ${objToUpdate.status}로 상태가 변경됐습니다.`);
    },
    
    printUsageErrorMessage() {
        console.log('[command]$[arg1]$[arg2]');
    },
    
    printNotExistErrorMessage() {
        console.log('존재하지 않는 ID입니다.');
    },
    
    printSameStatusErrorMessage() {
        console.log('이미 그 상태입니다.');
    },
}

module.exports = Printer;