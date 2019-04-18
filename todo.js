const makeId = require('./makeId');

class Todo {
  constructor(data) {
    this.data = data;
    this.todoCount = this.setTodoCount(data);
  }

  setTodoCount(data) {
    return data.reduce((acc, cur) => {
      acc[cur.status] =
        acc[cur.status] === undefined ? [cur.name] : acc[cur.status].concat(cur.name);
      return acc;
    }, {});
  }

  add(name, tags = '', inputPrompt) {
    // string type의 tags를 string type 배열로 만듦
    tags = tags.replace(/[\[\]\"\'\s]/g, '').split(',');

    const id = makeId();
    const addData = { name, tags, status: 'todo', id };

    this.data.push(addData);
    this.todoCount.todo.push(name);
    console.log(`${name} 1개가 추가되었습니다.(id : ${id})`);

    setTimeout(() => this.show('status', 'all', inputPrompt), 1000);
  }

  delete(id, inputPrompt) {
    const deleteInfo = this.filterById(id);

    if (deleteInfo.length !== 0) {
      this.data.splice(deleteInfo[0], 1);
      this.todoCount = this.setTodoCount(this.data);

      console.log(`${deleteInfo[1]} todo가 목록에서 삭제되었습니다.`);
    } else {
      console.log('입력하신 id가 존재하지 않습니다.');
    }

    setTimeout(() => this.show('status', 'all', inputPrompt), 1000);
  }

  filterById(id) {
    let deleteInfo = this.data
      .map((todo, i) => (todo.id === Number(id) ? [i, todo.name] : undefined))
      .filter(index => index !== undefined);

    // flat method ES2019에 새로 도입, node 11.0버전 이상부터 사용가능
    return !Array.prototype.flat ? deleteInfo[0] : deleteInfo.flat();
  }

  show(type, condition, inputPrompt) {
    let result;
    if (type === 'status') {
      if (condition === 'all') {
        result = this.printAll();
      } else {
        result = this.printStatus(condition);
      }
    } else {
      result = this.printTags(condition);
    }
    console.log(result);
    // console.log(makeId());
    inputPrompt.prompt();
  }

  printAll() {
    return Object.entries(this.todoCount).reduce((acc, cur) => {
      return (acc += `${cur[0]}: ${cur[1].length}개 `);
    }, '현재상태 : ');
  }

  printStatus(status) {
    return `${status}리스트 총 ${this.todoCount[status].length}건 : ${this.todoCount[status].join(
      ', '
    )}`;
  }

  printTags(tag) {
    const tagArr = this.data.filter(todo => todo.tags.includes(tag)).map(obj => obj.name);
    return `${tag} 키워드 검색 결과 : ${tagArr.join(', ')}`;
  }
}

module.exports = Todo;
