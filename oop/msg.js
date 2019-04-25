const MSG = function() {};

MSG.prototype.add = function(name, id) {
  return `${name}이(가) 추가됐습니다.(id: ${id})`;
};

MSG.prototype.delete = function(name, status) {
  return `${name}이(가) ${status} 목록에서 삭제됐습니다`;
};

MSG.prototype.update = function(name, status) {
  return `${name}이(가) ${status}로 상태가 변경되었습니다.`;
};

MSG.prototype.DONT_HAVE_SEPERATOR = function(seperator) {
  return `${seperator}가 없습니다. 다시 입력해주세요.`;
};

MSG.prototype.SAME_STATUS = function(originStr, changingStr) {
  return `원래의 상태 '${originStr}'가 변경 할 상태 '${changingStr}'와 같습니다. 다시 입력해주세요.`;
};

MSG.prototype.INVALID_ID = function() {
  return `입력 하신 id가 존재하지 않습니다. 다시 입력해주세요.`;
};

MSG.prototype.INVALID_INST = function() {
  return `입력 하신 명령어가 존재하지 않습니다. 다시 입력해주세요.`;
};

MSG.prototype.INVALID_CONDITION = function() {
  return `Show 명령에 입력 하신 조건이 존재하지 않습니다. 다시 입력해주세요.`;
};

module.exports = MSG;
