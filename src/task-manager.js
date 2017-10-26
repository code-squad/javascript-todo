var Manager = (function () {
  function Manager() {
    this.tasks = [];
    this.nextId = 0;
    this.task = new Task();
  }


  //에러 체크용 테스크 갖고 있는지 여부 리턴
  function hasTask() {
    return;
  }

  //이름 받아서 todo에 테스크 추가
  function addTask(name) {
  }
  function showTasks() {
  }
  function showAllTasks() {
  }
  //doing이나 done으로 업데이트. doing이라면  
  function updateTask(name, state) {
  }
  function checkShortestTask() {
    return;
  }
  return Manager;
})();

module.exports = Manager;