const todosList = {
    todos: [],
    id: 0,
    add({name, tag}) {
        this.todos.push({
            name: name,
            tag: tag,
            id: this.changeTodoId()
        });
        console.log(`id: ${this.id}, ${name} 항목이 새로 추가되었습니다.`);
        console.log(this.todos);
    },
    changeTodoId(){
        return ++this.id;
    },
};

todosList.add({name: "자바스크립트 공부하기", tag:"programming"});


//> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
//id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
//현재상태 :  todo:1개, doing:2개, done:2개
//
//> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
//id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
//현재상태 :  todo:1개, doing:1개, done:4개  
//
//> todo.remove({id:3});
//id:3, iOS공부하기 삭제완료. '