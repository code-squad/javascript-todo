### 1. 어떻게 설계할까?

1. 실제 프로그램이 동작하는 방법(시간)에따라 설계를 해보자.

2. 이전에 짰던 코드의 메소드들을 보고 객체로 묶어보자



### 2.이전에 짰던 코드의 함수

- showCurrentStatus : 현재상태 출력

- showFilteredtodo : 필터된 데이터를 출력



- showTodo : 조건에 따라 showCurrent, showFileredTodo 함수를 실행

- addTodo : 새로운 todo 객체를 만들고, 입력받은 키워드(이름,태그)를 객체에 할당함. 

- updateTodo : 입력받은 id에 입력받은 키워드로 상태를 변경 

- deleteTodo: 입력받은 id를 삭제 

- getHashcode : id값을 만드는 함수

- todoObject : 미리 생성된 객체 



- parseCommand : 사용자의 입력을 분류하고, 입력에 따라 COMMAND_DICT객체의 함수를 실행하도록 함. 

- run : 실제 프로그램을 실행, exit을 만나기전까지 종료되지 않고 사용자의 입력을 받고, 입력을 받을때마다 parseCommand 함수가 실행되도록 함. 



### 3. 설계된 최종 객체   

show 객체 , controller 객체, app 객체를 만들자! 

프로그램은 app객체에서 controller의 객체의 메소드를 부르고 controller에서 show객체의 메소드를 부르는 방식으로 동작한다! 

