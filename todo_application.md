# 할일관리 프로그램

- ### 기본기능

  - 할일을 추가할 수 있다.
  - 할일이 추가되면 id 값을 생성하고 결과를 알려준다.
  - 상태는 3가지로 관리된다. todo, doing, done.
  - 각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
  - 각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
  - 명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.

  ```javascript
  command("add$자바스크립트 공부하기");
  > id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 출력
  > 현재상태 :  todo:1개, doing:2개, done:2개

  command("show$doing");
  > "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

  command("show$done");
  > //완료 목록을 위 doing과 같은 형태로 노출한다.

  command("update$3$done");
  > 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.

  ```

- ### 설계

  - **Data**
    - Object
      - id
      - content
      - ~~state~~
    - Array Push
  - **Method**
    - command(data) : 명령문을 입력받는 기능
      - 문자 `$` 를 구분하기 위해 **정규표현식이 사용**되어야 할 것 같음
    - addWorkToDo() : 할일을 새로 추가하는 기능
      - id 값 체크하기
    - showWorkList() : `todo` `doing` `done` 를 보여주는 기능
      - 하나의 함수에서 전부 처리
    - updateWorkState() : 상태 갯수 변경
    - printCurrentState() : 현재상태 출력













































