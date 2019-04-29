const View = {
    printShowMessage(resultData) {
        if(resultData[0] === 'all') {
            console.log(`현재상태 : todo:${resultData[1].todo}개, doing:${resultData[1].doing}개, done:${resultData[1].done}개`);
        } else {
            console.log(`${resultData[0]}리스트 : ${resultData[1].length}건 : ${resultData[1]}`);
        }
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

module.exports = View;