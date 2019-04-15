const todos = [
  {
    name: "자바스크립트 공부하기",
    tags: ["programming", "javascript"],
    status: "todo",
    id: 12123123
  },
  {
    name: " 그림 그리기",
    tags: ["picture", "favorite"],
    status: "doing",
    id: 312323
  },
  {
    name: "IOS 공부하기",
    tags: ["programming", "ios"],
    status: "todo",
    id: 3123233
  },
  {
    name: "글쓰기",
    tags: ["writing", "hobby"],
    status: "doing",
    id: 31232311
  },
  {
    name: "운동",
    tags: ["health", "hobby"],
    status: "done",
    id: 312323555
  }
];

function printResult(result, query) {
  let str = "";
  if (query === "all") {
    str = "현재 상태 : ";
    str += Object.entries(result)
      .map(v => `${v[0]} : ${v[1]}`)
      .join(", ");
  } else {
    str = `${query} 리스트 : 총${result.length}건 : ${result.join(", ")}`;
  }
  console.log(str);
}

const show = query => {
  let show_result;
  if (query === "all") {
    show_result = todos.reduce(function(a, e) {
      a[e.status] = a[e.status] + 1 || 1;
      return a;
    }, {});
  } else {
    show_result = todos.filter(v => v.status === query).map(v => v.name);
  }
  printResult(show_result, query);
};

show("all");
show("doing");
