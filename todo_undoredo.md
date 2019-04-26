## STEP 5-3 디자인 구현방안

### 1. 신규 delete배열 설정

* 조건
  1. 배열의 길이는 3
  2. delete 배열 길이가 3이 넘아갈 때 새로운 요소가 들어온다면 shift 메서드를 사용하여 첫 번째 요소를 삭제

### 2. Undo

1. `**delete,414`를 input 수신**

   1-1. delete한 요소의 ID값을 확인하여 기존 데이터에서 검색

   1-2. 해당 ID값에 key값(wasDeleted)을 true로 할당

   1-3. ID값이 유효하다면 TodoList의 배열의 객체를 splice 메서드를 사용하여 todolist 배열에서 객체를 삭제하는 동시에 새로운 변수에 저장

2. `undo` 명령어 수신 시

   2-1. todolist의 마지막 요소(delete한 요소라는 key값 보유)를 pop메서드를 사용하여 새로운 변수에 저장

   2-2. 새로운 변수에 저장된 요소를 push메서드를 사용하여 todolist 배열에 push

3. undo에 맞는 콘솔메세지 생성

### 3. Redo

1. `redo` 명령어 수신

   1-1. delete한 요소의 key값이 매칭이 되는 지 확인

   1-2. todolist 마지막 요소를 pop메서드를 사용하여 새로운 변수에 저장

   1-3. 새로운 변수에 저장된 요소를 기존에 생성한 delete배열에 push

2. redo에 맞는 콘솔메세지 생성