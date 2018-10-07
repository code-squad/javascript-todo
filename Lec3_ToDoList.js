let tasks = [];
let id = [];
const todo = {
    add(toDoList) {
        this.id = id.length + 1;
        id.push(this.id);
        toDoList.id = this.id;
        tasks.push(toDoList);
        console.log(`id : ${this.id}, "${toDoList.name}" 항목이 새로 추가되었습니다. \n현재 상태 - todo: #개, doing: #개, done: #개 `);
    }
}

todo.add({
    name: "자바스크립트 공부하기",
    tag: "programming"
});

todo.add({
    name: "자바스크립트 공부하기2",
    tag: "programming"
});

console.log(tasks);

/*
> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
현재상태 :  todo:1개, doing:2개, done:2개

> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
현재상태 :  todo:1개, doing:1개, done:4개  

> todo.remove({id:3});
id:3, iOS공부하기 삭제완료. '
*/