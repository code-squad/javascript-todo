const ShowPrint = class {
    printShowAll(todo, doing, done){
        console.log(`현재 상태 : todo: ${todo}개, doing: ${doing}개, done: ${done}개`)
    }
    printShowElse(temp_length, temp){
        console.log(`${this.value1}리스트 : 총 ${temp_length}건 : ${temp}`);
    }
    printAdd(name,id){
        console.log(`${name} 1개가 추가됐습니다. (id : ${id})`);
    }
    printUpdate(targetName, status){
        console.log(`${targetName} 가 ${status}상태로 변경되었습니다.`);
    }
    printDelete(targetName){
        console.log(`${targetName} 가 todo에서 삭제되었습니다.`)
    }
    printError(errorKey){
        console.log(errorKey)
    }
}



module.exports = {
    ShowPrint
}
