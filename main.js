const todos = require('./data.js')


// 배열 속의 object 값 중 키워드 str과 일치하는 값을 filter로 추출후, 그 값에 해당하는 object.name의 값을 map을 이용해 배열에 담았습니다.
const optimizedFunc = (obj, str) => {
return obj.filter(el => el.status === str).map(el => {return el.name});
} 


const show = {
'all' : function(obj) {
  let todoListName = optimizedFunc(obj, 'todo');
  let doingListName = optimizedFunc(obj, 'doing');
  let doneListName = optimizedFunc(obj, 'done');
  return `현재상태 : todo: ${todoListName.length}개, doing: ${doingListName.length}개, done: ${doneListName.length}개`;
},

'todo' : function(obj) {
  let todoListName = optimizedFunc(obj, 'todo');
  return `todo 리스트 : 총 ${todoListName.length}건 : ${todoListName}`;
}
};


console.log(show.todo(todos));
console.log(show.all(todos));