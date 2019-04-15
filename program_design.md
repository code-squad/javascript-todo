# 20190415

## 수업

---

- forEach, map, filter를 잘 써야함
- for 대체하는 메서드들의 장점
    - for 문을 안 쓰기 때문에 추상화가 더 쉬움, 가독성 상승
    - 배열 길이를 알 필요 X
    - 메소드 체이닝이 가능해짐
        - 문제를 쪼개고, 나눠서 프로그래밍을 하는 습관을 가질 것

            ```javascript
            [1,2,3,4,5]
            .map(v=>v*2)
            .filter(v=>v%2)
            .forEach(console.log)
            ```

    - 테스트 코드 짜기가 쉬워짐
- map과 filter는 원래의 데이터를 건들지 않음
- 코드에서 의도를 통해 예상이 되어야 함
- map,filter와 reduce의 차이
    - reduce는 배열이 들어가서 객체가 나올 수 있는 등 새로운 차원의 데이터를 만들 수 있음
    - 잘 모르겠으면 debugger명령어 써서 디버깅하기

        ```javascript
        [1,2,3,4].reduce((prev,next)=>{
        	debugger;
        	return prev+next;
        })
        ```

### 프로그래밍 설계

- 어떤 인자를 받고 어떤 결과를 리턴 할 것인지를 정함
- 해야할 일 목록을 크게 나눠 만들어 순서를 정해서 계획함

## 미션

---

### 학습목표

- 프로그래밍 전에 코드의 디자인을 해보자.

### 사전 지식

- **의사 코드(Pseudo Code)**
    - 정의
        - 컴퓨터 프로그램이나 알고리즘이 수행해야 할 내용을 우리의 언어로 간략하게 서술해 놓은 코드를 뜻함
    - 장점
        1. 실제 코딩 전 사고를 좀 더 명확하게 만들어 줌 → 시간 단축
        2. 코드 검토가 더 쉬워짐
        3. 코드 수정을 더 쉽게 해줌
        4. 의사코드는 코멘트 작성에 대한 부담을 줄여줌
            - 수도 코드 자체가 코멘트의 축약형이기 때문
    - 효과적으로 의사 코드를 작성하는 방법
        - 의사 코드와 코드를 모두 같은 스타일로 일관성 있게 작성하기 → 똑같은 연산 기호 사용, 적절한 곳에 이해 가능한 문장으로 작성
        - 불필요한 내용 무시
        - 확실한 내용을 여러번 말하지 않음
        - 프로그래밍에 쓰이는 문법을 이용해 작성
        - 사용할 목적과 상황에 주의하여 작성
        - 수준을 고려해 작성
    - 의사코드용 영단어
        - 입력(Input): READ, OBTAIN, GET
        - 출력(Output): PRINT, DISPLAY, SHOW
        - 계산(Compute): COMPUTE, CALCULATE, DETERMINE
        - 초기화(Initialize): SET, INIT
        - 요소를 추가(Add one): INCREMENT, BUMP
        - 선형적으로 증가할 때(linear progression): SEQUENCE
        - 반복: WHILE, FOR
        - 조건문: IF-THEN-ELSE
        - 마지막에 조건문이 있는 반복문: REPEAT-UNTIL
        - IF-THEN-ELSE 대신 조건 분기처리: CASE
        - 부울 : TRUE / FALSE
        - 그외 : REPEAT - UNTIL RETURN BEGIN / EXCEPTION / END

> 참고 : [https://sujinlee.me/pseudocode/](https://sujinlee.me/pseudocode/)

### 미션

- 할 일 관리 프로그램 → todos.js 함수에 대한 설계와 코드 구현을 한 후 이를 PR

    ```javascript
    //todos.js
    const todos =  [ 
        {
            'name' : '자바스크립트 공부하기', 
            'tags' : ['programming', 'javascript'],
            'status' : 'todo',
            'id' : 12123123
        },
        {
            'name' : ' 그림 그리기', 
            'tags' : ['picture', 'favorite'],
            'status' : 'doing',
            'id' : 312323
        }
    ];
    
    const show = (input) => {
    
        console.log(result);
    }
    
    show("all");
    show("todo");
    ```

    - todos.js에서는 show함수가 두 번 불림
    - 결과는 다음과 같음

        ```bash
        $ nodejs todos.js
        
        현재상태 :  todo: 1개, doing:2개, done:4개
        todo리스트 :  총3건 : ' 자바스크립트 공부하기' , 'iOS공부하기'
        ```

- 가장 먼저 우리의 **목표**는 `all`과 `todo`등을 옵션으로 주어 함수를 실행, 그에 해당하는 결과를 콘솔 창에 찍는 함수를 찍는 것
- 이를 의사 코드로 먼저 작성해 보려고 함
- `input`과 `output`에 무엇이 해당하는지 경우를 나눠 살펴봄
    - `input`은 세 가지의 경우가 있음
        - `all`
        - `status`
        - `etc`
    - output의 경우 두 가지의 경우가 있음
        - `all` → `status` 각각에 해당하는 총 개수
        - `나머지` → 해당 `status`의 총 개수, `status.name` 목록
- 필요한 것에 대해 먼저 생각을 해 봤을 때 다음과 같음
    1. `status` 판별 분기문 → `input`에 따른 3가지 경우
    2. 이터레이터 → 전체 데이터를 탐색, `reduce`를 써볼 예정
    3. 판별된 데이터 객체 → 전체 데이터에서 필요한 데이터를 뽑아 담아 둘 객체
- 판별된 데이터를 담아 둘 객체를 생각해 보면 다음과 같음

    ```javascript
    const statusObject = {
    	status:{
    		count,
    		nameList
    	}
    }
    ```

    - 여기서 count의 경우 nameList의 length로도 충분히 가능하기 때문에 삭제, 총 두 가지의 데이터를 담고 있다가 결과로 반환하면 됨

        ```javascript
        const statusObject = {
        	status:{
        		nameList
        	}
        }
        ```

- 일반적으로 데이터를 불러오는 호출이 자주 있다고 생각하면 프로그램이 시작될 때, 미리 nameList를 가지고 있는 것이 더 효율 적일 것으로 생각됨

    - 데이터를 호출할 때마다 이터레이터가 작동하여, 필요한 데이터를 가져오려 할 경우 속도면에서 문제가 있을 것이라 생각
- 필요한 함수에 대해 생각해 봄
    1. 처음 프로그램을 시작하면 `statusObject`를 자동 생성
    2. `show`함수 실행 시 `status`에 해당하는 데이터를 `statusObject`에서 가져옴
    - **각 함수의 이름에 맞게 기능을 확실히 분리할 것**
- 앞에 정한 내용들을 기반으로 수도코드를 작성

    ```javascript
    //todos.js
    const todos =  [ 
        {
            'name' : '자바스크립트 공부하기', 
            'tags' : ['programming', 'javascript'],
            'status' : 'todo',
            'id' : 12123123
        },
        {
            'name' : ' 그림 그리기', 
            'tags' : ['picture', 'favorite'],
            'status' : 'doing',
            'id' : 312323
        }
    ];
    
    //각각의 status 해당하는 빈 array
    let statusObject = { 
    	'todo': [],
    	'doing': [],
    	'done': []
    }
    
    //초기 statusObject데이터 생성 함수
    const init_data = function() {//GET dataObject from outside
    	//FOR dataObject
    	//  IF (status === 'todo')
    	//    THEN PUSH 'name' to statusObject.status;
      //  ELSE IF (status === 'doing')
      //    THEN PUSH 'name' to statusObject.status;
    	//  ELSE
      //    THEN PUSH 'name' to statusObject.status;
      //PRINT "Init Completed!"
    };
    //input을 받아 출력을 위한 함수
    const show = (input) => {
    	//IF (input === 'all')
    	//  THEN PRINT statusObject[input].length each
    	//ELSE IF (input === 'todo' OR 'doing' OR 'done')
    	//  THEN PRINT statusObject[input].length
    	//ELSE
    	//  THEN ERROR Handling
    };
    
    init_data();
    show("all");
    show("todo");
    ```

- 완성된 의사 코드를 기반으로 코드를 작성, 작성된 의사 코드는 주석으로 수정하여 남겨둠

    ```javascript
    //todos.js
    const todos =  [ 
        {
            'name' : '자바스크립트 공부하기', 
            'tags' : ['programming', 'javascript'],
            'status' : 'todo',
            'id' : 12123123
        },
        {
            'name' : ' 그림 그리기', 
            'tags' : ['picture', 'favorite'],
            'status' : 'doing',
            'id' : 312323
        }
    ];
    
    //각각의 status 해당하는 빈 array
    let statusObject = { 
    	'todo': [],
    	'doing': [],
    	'done': []
    };
    
    //초기 statusObject데이터 생성 함수
    const init_data = (todos) => { //DB 객체의 데이터를 불러옴
        //FOR 전체 DB 객체 탐색
        todos.forEach((item) => {
            if (item.status === 'todo') { //status가 todo일 때
                statusObject.todo.push(item.name);
            } else if (item.status === 'doing') { //status가 doing일 때
                statusObject.doing.push(item.name);
            } else { //status가 done일 때
                statusObject.done.push(item.name);
            }
        });
        // 초기화 완료 출력
        console.log("Init Completed!");
    };
    //input을 받아 출력을 위한 함수
    const show = (input) => {
        if (input === 'all') { // 입력이 all일 때
            console.log(`현재상태 :  todo: ${statusObject.todo.length}개, doing: ${statusObject.doing.length}개, done: ${statusObject.done.length}개`);
        } else if ('todo doing done'.includes(input)) { // input이 status일 때
            let statusNameList = statusObject[input].join(', ');
            console.log(`${input}리스트 :  총${statusObject[input].length}건 : ${statusNameList}`)
        } else{ //input이 다른 입력일 때
            throw new Error('올바르지 않은 입력입니다.');
        };
    };
    
    init_data(todos);
    show("all");
    show("todo");
    show("doing");
    ```