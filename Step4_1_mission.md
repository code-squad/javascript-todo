# Step 4-1 Mission

---

> ### 첫 번째 Pseudo Code 설계

* show 함수의 인자 값에 따라 어떻게 처리할 것인지?

  1. switch 문을 이용해서 'all', 'todo', 'doing', 'done' 을 개별적으로 처리

* todos 배열에 담아있는 객체에 어떻게 접근할지 생각하자

  1.  for ..of 문을 이용하여 todos 배열의 값을 접근 하자 ( 배열 안의 데이터는 객체임 )

* 객체의 'name' 을 어떻게 리턴하지?
  1. 객체의 'status' 에 접근하는 코드를 설계하자
  2. 객체의 'status' 에 접근을 하면 함수의 인자값과 비교한다. ('all', 'todo', 'doing', 'done')

  ```javascript
  // pseudo 코드
  function show(type) {
    switch (type)
      case 'all' 	 : break;
      case 'todo'  : break;
      case 'doing' : break;
      case 'done'  : break;
      
      for (obj of todos) {
        // 배열에 값에 접근..
        if ('todo') 			// todo 의 count 증가
  			else if ('doing') // doing 의 count 증가
  			else if ('done')	// done 의 count 증가
      }
  }
  ```

  

---

> ### 두 번째 Pseudo Code 설계 - 중복되는 코드 제거

* 첫 번째 구현에서 if 문으로 인한 중복되는 코드가 많음. 리팩토링 하자

  1. if 문으로 'todo', 'doing', 'done' 의 count 증가 방식을 변경

     -> status 객체를 만들어서 count 를 증가한다.

  ```javascript
  // 변경 전 pseudo 코드
  if ('todo') 			// todo 의 count 증가
  else if ('doing') // doing 의 count 증가
  else if ('done')	// done 의 count 증가
  
  // 변경 후 pseudo 코드
  const status = { 'todo': 0, 'doing': 0, 'done': 0 };
  status[obj['status']]++;	// 'status' 속성의 값을 가져와 count 을 증가시키는 방식
  ```

* 코드의 중복을 제거함으로써 가독성이 좋아졌다. 당연히 결과도 잘 나온다.

---

> ###  최종 Pseudo Code

* Pseudo Code 로 표현

  ```javascript
  function show(type) {
      var status = {'todo': 0, 'doing': 0, 'done': 0};
      var list = [];
      
      for (object fo todos) {
      	if (object['status'] == type)
        		list.push(object['name']);
      	status[object['status']]++;
      }
                        
     print('현재 상태 출력');
  }
  ```

  



