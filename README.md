# todo
레벨2


github 저장소
https://github.com/code-squad/javascript-todo

요구사항
다음처럼 동작하는 프로그래밍을 만든다.

할일관리하는 프로그램이며, 다음의 기능이 있다.

할일을 추가할 수 있다.

1. add Todo 
2. todo { state -> todo, doing, done }
3. show( tasks )
4. show( 명령함수$구분자) 

할일이 추가되면 id 값을 생성하고 결과를 알려준다.
상태는 3가지로 관리된다. todo, doing, done.
각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.
command("add$자바스크립트 공부하기");
> id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 출력
> 현재상태 :  todo:1개, doing:2개, done:2개

command("show$doing");
> "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

command("show$done");
> //완료 목록을 위 doing과 같은 형태로 노출한다.

command("update$3$done");
> 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.



#### 요구사항을 바탕으로 디자인 

1. Command를 통해서 모든 명령어 진행 
2. Command('명령어')-> 명령어를 읽는 함수 번역 하는 함수 필요 
3. 명령어 번역 함수에는 $를 구분자로 
3.1 add, show, update 가 있고 
3.2 add에서는 add$task 
3.3 show에서는 show$filter-> search해서 보여주기 
3.4 update$id$state -> id에 접근해서 상태를 바꿔 줄 수 있다. 


