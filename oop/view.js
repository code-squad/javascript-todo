const utility = require('./utility');

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

    printUndoMessage(command, undoObj) {
        switch(command) {
            case 'add' :
                console.log(`${undoObj.id}번항목 ${undoObj.name}이 다시 삭제되었습니다.`);
                break;
            case 'delete' :
                console.log(`${undoObj.id}번항목 ${undoObj.name}이 삭제에서 ${undoObj.status} 상태로 변경되었습니다.`);
                break;
            case 'update' :
                console.log(`${undoObj[0].id}번항목 ${undoObj[0].name}이 ${undoObj[0].status} 상태에서 ${undoObj[1]} 변경되었습니다.`);
                break;
        }
    },
    printRedoMessage(command, redoObj) {
        switch(command) {
            case 'add' :
                console.log(`${redoObj.id}번항목 ${redoObj.name}이 다시 추가되었습니다.`);
                break;
            case 'delete' :
                console.log(`${redoObj.id}번항목 ${redoObj.name}이 ${redoObj.status} 상태에서 삭제됐습니다.`);
                break;
            case 'update' :
                console.log(`${redoObj[0].id}번항목 ${redoObj[0].name}이 ${redoObj[1]} 상태에서 ${redoObj[0].status} 변경되었습니다.`);
                break;
        }
    }
}

module.exports = View;