# STEP 4-1 프로그램 디자인 하기

## 요구사항

- 해야 할 일이 객체로 담긴 todos 배열이 있다.

  - 해야 할 일 객체란 아래와 같은 형태를 가지고 있다.

  ```
  'name' : '자바스크립트 공부하기',
  'tags' : ['programming', 'javascript']
  'status' : 'todo'
  'id' : 12123123
  ```

- show함수는 호출 시 매개변수에 따라서 달라진다.

  - **1)매개 변수의 값이 "all" 일 경우 :** todos 배열에 담긴 객체 중 객체의 각 상태(todo, doing, done)별 갯수를 카운트한 결과를 출력한다.
  - **2)매개 변수의 값이 "all"이 아닐 경우 :** todos 배열에 담긴 객체 중 매개 변수로 주어진 값과 status 프로퍼티의 값이 같은 name 프로퍼티와 총 객체의 수를 출력한다.

- 출력 예시는 다음과 같다.

```
show("all"); // 현재상태 :  todo: 1개, doing:2개, done:4개
show("todo") // todo리스트 :  총3건 : ' 자바스크립트 공부하기' , 'iOS공부하기'
```

## 프로그램 디자인

- show() 디자인

![show함수 디자인](https://user-images.githubusercontent.com/18614517/56113193-1a27e280-5f98-11e9-8bbf-cb8add4e343f.jpg)

- printResult() 디자인

![printResult디자인](https://user-images.githubusercontent.com/18614517/56113229-388dde00-5f98-11e9-9cc7-0cb2a3291803.jpg)
