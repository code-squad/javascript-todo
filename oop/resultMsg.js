const ResultMsg = function () {

}
ResultMsg.prototype = {
  invalidId : function(id) {
    return `${id}에 해당하는 todo는 없습니다.`
  },
  sameStatus : function() {
    return `바꾸려는 내용이 현재 내용과 똑같습니다. 다시 확인하세요.`
  },
  updateMsg : function(name, statusToChange) {
    return `${name}가 ${statusToChange}로 변경되었습니다.`
  },
  deleteMsg : function(name, status) {
    return `${name} ${status} 가 삭제됩니다.`
  },
  addMsg : function(name, id) {
    return `${name} 1개가 추가되었습니다.(id: ${id})`
  },
  showAllMsg : function(counted) {
    return `현재상태 : todo: ${counted.todo}개, doing: ${counted.doing}개, done: ${counted.done}개`
  },
  showStatus : function(result, option, counted) {
    return `${option}리스트 : 총${counted[option]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`
  }
}

module.exports = ResultMsg