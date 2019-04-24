module.exports = {
  add(name, id) {
    return `${name}이(가) 추가됐습니다.(id: ${id}) \n`;
  },
  delete(name, status) {
    return `${name}이(가) ${status} 목록에서 삭제됐습니다`;
  },
  update(name, status) {
    return `${name}이(가) ${status}로 상태가 변경되었습니다.`;
  }
};
