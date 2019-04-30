class ResultMsg {
  invalidId (id) {
    return `${id}에 해당하는 todo는 없습니다.`
  }
  sameStatus () {
    return `바꾸려는 내용이 현재 내용과 똑같습니다. 다시 확인하세요.`
  }
  updateMsg (name, statusToChange) {
    return `${name}가 ${statusToChange}로 변경되었습니다.`
  }
  deleteMsg (name, status) {
    return `${name} ${status} 가 삭제됩니다.`
  }
  addMsg (name, id) {
    return `${name} 1개가 추가되었습니다.(id: ${id})`
  }
  showAllMsg (counted) {
    return `현재상태 : todo: ${counted.todo}개, doing: ${counted.doing}개, done: ${counted.done}개`
  }
  showStatus (result, option, counted) {
    return `${option}리스트 : 총${counted[option]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`
  }
  invalidCommand (){
    return `변경가능한 status는 todo, doing, done 입니다`
  }
  invalidArgsCounts () {
    return `인자의 갯수가 잘못되었습니다.`
  }
  noSeperator () {
    return `구분자가 없습니다.`
  }
  resultOfUndoRedo ({id, name, command, undoOrRedo, currentStatus, postStatus}){
    return currentStatus ? 
    `${id}번 항목 '${name}'의 상태가 ${currentStatus}에서 ${postStatus}로 변경되었습니다.` :
    `${id}번 항목 '${name}' ${command} 가 ${undoOrRedo} 되었습니다.` 
    
  }
}

module.exports = ResultMsg