var Manager = {
  tasks: [],
  nextId: 0,
  // this.task = new Task();

  //테스크 갖고 있는지 여부 리턴
  hasTask: function () {
    return;
  },
  //이름 받아서 todo에 테스크 추가
  //id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
  addTask: function (name) {
  },
  //
  showTasks: function (state) {
  },
  //
  showAllTasks: function () {
  },
  //doing이나 done으로 업데이트. doing이라면 시간 기록, done이라면 시간 비교해서 넣음
  updateTask: function (name, state) {
  },
  checkShortestTask: function () {
    return;
  }
};

module.exports = Manager;