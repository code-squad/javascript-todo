## ToDo 앱
### 나름대로 만들고 싶은 ToDo앱을 생각했다.
- Todo항목은 자유롭게 기술할 수 있다.
- status에는 제한이 없다.
- tag 대신 category를 썼다. category는 String 타입이다.
- deadline 속성을 추가했다. show 함수는 deadline이 가까운 순서대로 출력한다.

### 설계
<!-- 1. preshow()함수를 호출할 때 필터 인자를 확인한다.  
1.1 인자에 따라 todos 전체를 함수에 전달하거나, 필터링된 todos를 전달한다.
2. preshow()함수에는 내부함수 printTodos가 있다.
3. printTodos는 배열을 받아서 deadline이 낮은 순으로 정렬한, sortedDeadline배열을 만든다.
4. sortedDeadline의 순서대로, 원래의 todos를 출력한다. -->
1. preshow함수를 호출하면, 인자에 따라 다른 동작을 한다.
2. deadline속성에 따라 정렬된 todos를 출력한다.
3. 정렬을 위해 중간 결과물로, {deadline:id} 객체를 내부에서 생성한다.
4. 내부 객체의 순서대로 todos를 출력한다.

### 미션에서 제시된 ToDo 앱
- 기본 데이터를 마음대로 바꾸었다.

### 설계
1. 그루핑을 Map객체를 이용하여 수행한다.
2. 과도한 forEach문을 줄였다.


