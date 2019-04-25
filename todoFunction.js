const printHelpMessage = (() => {
  const helpMessage = `사용법
  1) 검색하기 : show$<all|todo|doing|done>
  2-1) 추가하기 : add$name$["tag1", "tag2", ...]
  2-2) 추가하기 : add$name$["tag1", "tag2", ...]$status
  3) 삭제하기 : delete$id
  4) 수정하기 : update$id$status
  `;
  return () => console.log(helpMessage);
})();

function addTodo(todos, name, tag, status = "todo") {
  try {
    const newtodo = {
      name,
      tag: JSON.parse(tag),
      status,
      id: uniqueIdGenerator()
    };
    todos.push(newtodo);
    console.log(`${newtodo.name} 1개가 추가되었습니다. ( id : ${newtodo.id})`);
    setTimeout(() => showTodo(todos, "all"), 1000);
  } catch (error) {
    console.error(`생성 실패 : ${error.message}`);
  }
}

function deleteTodo(todos, targetId) {
  try {
    targetId = parseInt(targetId);
    const targetTodo = todos.find(todo => todo.id === targetId);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);
    if (targetIndex === -1) {
      throw new Error("삭제할 대상이 없습니다. ");
    }
    todos.splice(targetIndex, 1);
    console.log(
      `${targetTodo.name} ${targetTodo.status}가 목록에서 삭제됐습니다.`
    );
    setTimeout(() => showTodo(todos, "all"), 1000);
  } catch (error) {
    console.error(`삭제 실패 : ${error.message}`);
  }
}

function updateTodo(todos, targetId, changeStatus) {
  try {
    targetId = parseInt(targetId);
    const targetTodo = todos.find(todo => todo.id === targetId);
    if (targetTodo === undefined) {
      throw new Error("수정할 대상이 없습니다. ");
    }
    targetTodo.status = changeStatus;
    setTimeout(() => {
      console.log(
        `${targetTodo.name}이(가) ${
          targetTodo.status
        }으로 상태가 변경되었습니다.`
      );
      setTimeout(() => showTodo(todos, "all"), 1000);
    }, 3000);
  } catch (error) {
    console.error(`갱신 실패 : ${error.message}`);
  }
}

const uniqueIdGenerator = (() => {
  var uniqueId = 1;
  return function() {
    return uniqueId++;
  };
})();

function printResult(data, text) {
  let str;
  if (text === "all") {
    str = `현재 상태 : `;
    str += Object.entries(data)
      .map(v => `${v[0]} : ${v[1]}`)
      .join(", ");
  } else {
    str = `${text} 리스트 : 총 ${data.length}건 : ${data.join(", ")}`;
  }
  console.log(str);
}

function showTodo(todos, status) {
  let result;
  if (status === "all") {
    result = todos.reduce((p, c) => {
      p[c.status] = p[c.status] + 1 || 1;
      return p;
    }, {});
  } else {
    result = todos.filter(v => v.status === status).map(v => v.name);
  }
  printResult(result, status);
}

module.exports = {
  add: addTodo,
  delete: deleteTodo,
  update: updateTodo,
  show: showTodo,
  help: printHelpMessage
};
