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

module.exports = MSG;
