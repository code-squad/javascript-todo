const ShowPrint = function() {}

ShowPrint.prototype.printShowAll = function(todo, doing, done){
    console.log(`현재 상태 : todo: ${todo}개, doing: ${doing}개, done: ${done}개`)
}
ShowPrint.prototype.printShowElse = function(temp_length, temp){
    console.log(`${this.value1}리스트 : 총 ${temp_length}건 : ${temp}`);
}
ShowPrint.prototype.printAdd = function(name,id){
    console.log(`${name} 1개가 추가됐습니다. (id : ${id})`);
}
ShowPrint.prototype.printUpdate = function(targetName, status){
    console.log(`${targetName} 가 ${status}상태로 변경되었습니다.`);
}
ShowPrint.prototype.printDelete = function(targetName){
    console.log(`${targetName} 가 todo에서 삭제되었습니다.`)
}
ShowPrint.prototype.printError = function(errorKey){
    console.log(errorKey)
}


module.exports = {
    ShowPrint
}
