function Printer() {}

Printer.prototype.printMessageShowAll = function (countEachStatus) {
    console.log(`현재상태 : todo:${countEachStatus.todo}개, doing:${countEachStatus.doing}개, done:${countEachStatus.done}개`);
}

Printer.prototype.printMessageShowStatus = function (status, listInStatus) {
    console.log(`${status}리스트 : ${listInStatus.length}건 : ${listInStatus}`);
}

Printer.prototype.printMessageAdd = function (objToAdd) {
    console.log(`${objToAdd.name} 1개가 추가됐습니다. (id: ${objToAdd.id})`);
}

Printer.prototype.printMessageDelete = function (objToDelete) {
    console.log(`${objToDelete.name}이 ${objToDelete.status}가 목록에서 삭제됐습니다.`);
}

Printer.prototype.printMessageUpdate = function (objToUpdate) {
    console.log(`${objToUpdate.name}이 ${objToUpdate.status}로 상태가 변경됐습니다.`);
}

Printer.prototype.printUsage = function () {
    console.log('[command]$[arg1]$[arg2]');
}

Printer.prototype.printNotExistErrorMessage = function () {
    console.log('존재하지 않는 ID입니다.');
}

Printer.prototype.printSameStatusErrorMessage = function () {
    console.log('이미 그 상태입니다.');
}

module.exports = Printer;