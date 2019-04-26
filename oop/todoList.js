const Todo = require('./todo');
module.exports = [
  new Todo(1, 'DB 연결',["DB", "Infra"] ,'done'),
  new Todo(2, '쿼리 생성', ["DB"] ,'doing'),
  new Todo(7, '테스트', ["Test"] ,'todo'),
];