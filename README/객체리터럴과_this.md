# 객체 리터럴과 this

### 이번시간의 목표는 `객체` 에 대해서 알아볼 것

- 객체지향 프로그래밍
  객체를 중심으로 속성과, 속성을 다루는 행위들의 집합
- 객체별로 구분한다 = Module
- Javascript는 객체가 간단 (Dictionary)





1. ### 자바스크립트 객체의 활용

   ```
   자바스크립트 객체는 사실 객체리터럴이 그 자체이며 객체를 쉽게 만들 수 있다.
   ```

   - #### [객체 리터럴 (Object Literal)](http://webclub.tistory.com/390)

     **객체 리터럴 (Object Literal) 을 사용해서 생성**함
     Object 객체의 구조를 정의하고 생성하는 구문을 **하나로** 합칠 수 있음
     `new` 와 `Object` 생성자를 이용해 객체를 생성
     필요한 구조를 만들어가는 과정을 좀 더 **간소화** 할 수 있음

     결과적으로, **코드가 간결**해지고 **가독성(Readability)이 높아짐**

   ```javascript
   var healthObj = {
     name : "달리기",
     lastTime : "PM10:12",
     showHealth : function() {
       console.log(this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요");
     }
   }

   healthObj.showHealth();
   ```

   - **점(.)** 은 `객체`를 뜻하는 것

     - console.log 에서의 console은 함수일까 객체일까?

       console 뒤에 점(.) 이 있으므로, **객체**이다

       **console 객체의 log라는 메소드**

   - var healthObj 가 없었다면

     - name과 lastTime은 전역변수가 될 것

   - 알고있던 객체와 동일하다는 것을 느낄 수 있음

   - showHealth 함수에서, `this` 로 사용하지 않고, `healthObj` 라고 사용해도 무관하나 그렇게되면 healthObj 라는 **전용 메소드**가 되어버림

   - 메소드의 유연함을 보장하기 위해 `this` 사용

     - this 값을 바꿔줄 수 있다, context가 바뀌어도 해당함수가 동작할 수 있게하는 방법이 있음

   - healthObj.showHealth() 는 healthObj 라는 객체의 showHealth 메소드를 뜻함

   - healthObj 객체 안의 this는 healthObj 를 가리킴

   - showHealth 가 어떻게 불렸나 라는 것은, 어떤 환경에서 불렸나 라는 것을 이해하면 쉬움

   - 해당 `this` 는 실행타임에 결정됨 (하지만 무조건은 아님)

   - 속성들은 method 를 통해서 접근하는 것이 좋은 방법

     - healthObj.lastTime 처럼 직접접근은 되도록 삼가하는게 좋음

   - 결론적으로, 비슷한 기능 (비슷한 분류) 들을 하나의 Object (객체) 로 묶어두는 것이 좋음

   ```javascript
   var todo = {
       todos : [],
       addTodo : function(newTodo) {
           this.data.push(newTodo);
       },
       showTodo : function() {
           return this.todos;
       }
   }
   ```

   - todo.addTodo("play");
   - todo.addTodo("sleeping...");
   - todo.showTodo();
     - (2) ["play", "sleeping..."]
   - namespace, 객체 하위에 또 다른 객체를 선언할 수 있음
   - Javascript의 객체는 Singleton 이다
     - 하나의 객체를 반환
   - 객체지향 프로그래밍을 알려면
     - ES6 Class - 상속
     - Prototype에 대한 이해 - new 키워드를 이용한 동적으로 Dynamic 객체를 이용





2. ### this

   객체 안에서의 this는 그 객체 자신을 가리킨다

   ES6에서는 객체에서 메서드를 사용할 때, function 키워드를 생략할 수 있음

   ```javascript
   const obj = {
      getName() {
        return this.name;
        },
     setName(name) {
         this.name = name;
       }
   }
   obj.setName("crong");
   const result = obj.getName();
   ```




3. ### this 좀더 알아보기

   JavaScript에는 전역스크립트나 함수가 실행될 때, 실행영역(Excution context) 가 생성됨

   실제 실행은 stack 공간에 올라가서 실행됨

   모든 context에는 참조하고 있는 객체(thisBinding)가 존재함

   현재 context가 참조하고 있는 객체를 알기 위해서는 this를 사용할 수 있음

   함수가 실행될 때, 함수에서 가리키는 this 키워드를 출력해보면 context가 참조하고 있는 객체를 알 수 있음

   ```javascript
   function get() {
       return this;
   }

   get(); // window. 함수가 실행될 때의 context는 window를 참조한다
   new get(); // object. new 키워드를 쓰면 새로운 object context가 생성된다
   ```

   **this는 바뀔 수 있다**

   ```
   var others = {
       todos : "난 절대로 아무것도 하지 않는다"
   }

   var todo = {
       todos : ['자바스크립트 공부하기"],
       addTodo : function(newTodo) {
           this.todos.push(newTodo);
       },
       showTodo : function() {
           return this.todos;
       }
   }

   todo.showTodo(); // ["자바스크립트 공부하기"]
   todo.showTodo.call(others); // ["난 절대로 아무것도 하지 않는다"]
   ```

   - `call` 에 의해서 **others** 가 불려짐





4. ### 결론

   - Singleton Pattern
   - Javascript 객체는 Key-Value 로 이루어진 객체 덩어리다
   - Tab UI 를 하나의 객체로 만들고
   - Tab UI 에 대한 method
     - Event 등록
     - Ajax 가져오는 것
     - Template 넣는 것
   - TabUI.sendAjax (this.sendAjax)
   - TabUI.init
   - 하나의 Component를 Object를 만들 수 있다
   - 해당 내용의 객체 리터럴은 하나의 단일객체임
   - 이를 재사용하기 위해 반복적이고 동일한 객체를 매번 만든다면 비효율적
   - 자바스크립트 객체를 동적으로 만드는 방법이 필요
   - 생성자 패턴
   - new 키워드를 사용해서 어떻게 객체를 만드는지 찾아서 살펴볼 것



5. ### 번외

   - this 알아보기 1편

   - JavaScript `this`

     - 런타임때 (함수가 불려질 때) this가 가리키는것이 변경될 수 있음
     - 그때 그때, 달라지기 때문에 헷갈릴 수 있음
     - 그래서, 디버깅 및 상황을 통해서 this가 가리키는 것을 학습 필요

     ```javascript
     function code() {
         console.log(this);
     }
     code(); // window
     ```

     ```javascript
     function code() {
         console.log(this);
     }
     new code(); // object (code)
     ```

     - new 키워드를 사용할 경우, 객체를 반환함 (object constructor)

     ```javascript
     var obj = {
         code : function() {
             this.printCode();
         },
         printCode : function() {
             console.log("print~~code");
         }
     }

     obj.code(); // obj 객체 중 this 가 가리키는 것은 전체 Object 로서, printCode가 실행됨
     ```

   - this 알아보기 2편 - async 해결

     ```javascript
     var obj = {
         code : function() {
             setTimeout(function() {
                 this.printCode();
             }, 1000);
         },
         printCode : function() {
             console.log("hello obj!!");
         }
     }

     obj.code(); // Error
     ```

     - code 라는 method가 실행되긴 하지만
     - setTimeout callback method는 obj나 code에 상관없이
     - EventQueue에 들어가게 된다
     - 그래서 1초뒤에, this.printCode()가 실행되지만
     - 객체와 전혀 상관없는 곳(EventQueue)에서 실행되기 때문에
     - this.printCode 가 실행되지 않는 것

     ```javascript
     var obj = {
         code : function() {
             setTimeout(function() {
                 this.printCode();
             }.bind(this), 1000);
         },
         printCode : function() {
             console.log("hello obj!!");
         }
     }

     obj.code(); // hello obj!!
     ```

     - **function 도 Object의 하나**

     - 그래서 함수 뒤에도 점(.)을 이용한 다른 함수를 호출할 수 있음

     - `bind(this)` 의 역할은 `this`가 `obj`를 가리키게 하는 것

     - debugger 을 이용하면 this 의 Type을 바로 알 수 있음

       ![](https://imgur.com/7joyMNV.png)

     - Event Callback 함수에서의 this