module.exports = {
  standard: "$",
  cmd: {
    add: "add",
    show: "show",
    update: "update",
    quit: "quit",
    shortestRecord: "shortestRecord"
  },
  state: {
    todo: "todo",
    doing: "doing",
    done: "done"
  },
  messages: {
    question: "원하시는 동작을 입력해주십시오.\n",
    retry: "잘못된 입력입니다. 다시 입력해주십시오.\n",
    currentStateMessage: (todoCount, doingCount, doneCount) =>
      `현재 상태 : todo(${todoCount}), doing(${doingCount}), done(${doneCount})\n`,
    quitNotice: "어플리케이션을 종료합니다.",
    isComplete: "아직 완료된 작업이 없습니다!\n",
    addComplete: (id, things) => `id: ${id}, "${things}" 항목이 새로 추가되었습니다.`,
    updateComplete: (id, things) => `id: ${id}, "${things}" 항목이 업데이트되었습니다.`,
    shortestRecordMessgage: record => `최단기록은 ${record}초입니다!\n`
  }
};
