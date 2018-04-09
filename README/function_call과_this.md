# function call 과 this

1. ### context와 this

   JavaScript 에는 전역스크립트나 함수가 실행될 때

   `실행영역(Excution Context)` 가 생성됨 

   함수단위로 실행영역이 생성됨

   실제로 실행은 메모리 중 `Stack 공간`에 올라가서 실행됨

   모든 Context 에는 **참조하고 있는 객체 (thisBinding)** 가 존재

   현재 Context가 참조하고 있는 객체를 알기 위해서 `this` 를 사용함

   즉, 함수에서 가리키는 `this` 키워드를 출력해보면

   **Context가 참조하고 있는 객체 (=this)**를 알 수 있음

   ​

2. ### [call](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call) Method

   call - context가 참조하는 객체 (=this) 를 변경시킬 수 있음

   ```javascript
   function get() {
       return this;
   }

   get.call({}); //{}. call로 임의의context를 지정할 수 있다.
   ```

   this는 저번시간에서도 언급했듯이, 런타임 때 결정되기 때문에 고정된것이 아니라 가변적으로 변경될 수 있음

   ```javascript
   fun.call(thisArg[, arg1[, arg2[, ...]]])
   ```

   `fun` 호출에 제공되는 `this` 값



3. ### call 활용 - 일반함수에서의 this 변경 (1/2)

   ```javascript
   var _  = {
     getName : function() {
       return this.name;
     }
   }

   function get() {
     this.name = this.name || "codesquad";
     return this.getName();
   }

   get(); // 이때의 get에서의 this가 가리키는것은 window 객체이므로 에러가 발생함, window 에는 getName이 없기 때문에
   get.call(_); // 너가 가리키는 this 는 이것(_)으로 부탁해
   // this가 가리키는 지점이 _ (Object) 로 변경됨
   // return this.getName()은 return _.getName()으로 변경됨
   ```

   ![](https://imgur.com/DCA2XDe.png)

   `this`가 가리키는 것이 `Object` 임을 알 수 있음

   다른 Object 에 대한 method 들을 훔쳐서(?) 사용할 수 있음



4. ### call 활용 - 일반함수에서의 this 변경 (2/2)

   ```javascript
   var _  = {
     getName : function() {
       return this.name;
     }
   }

   function get() {
     this.name = this.name || "codesquad";
     return this.getName();
   }

   function get2() {
     this.name = this.name || "codesquad2";
     return this.getName();
   }

   console.log(get.call(_));  //codesquad
   console.log(get2.call(_)); //codesquad
   ```

   get2 에서도 똑같은 결과가 나오는 것은 앞의 `get.call(_)` 문에서 this에 대한 할당이 일어났기 때문에, get2에서도 똑같이 codesquad가 출력되는 것

   즉, `get`과 `get2`에서 가리키는 `this`가 동일한 `this` 임을 파악!



5. ### call - 아직 활용은 그다지 .. 그럼 call 이 필요할 때는 ? (1/2)

   ```javascript
   const obj = {
      value : "codesquad",
      run : function() {
        function printValue() {
          console.log(this);
          console.log(this.value);
        }
        (function() {
          printValue();
        });
      }
   }
   ```

   - `obj.run()` 을 실행하면, 즉시실행함수의 `printValue()` 가 실행되어
     `this`  는 `window` 를 가리키게 됨
   - 그래서 바꿔주고 싶다라는 생각이 들것이다

   ```javascript
   var obj = {
      value : "codesquad",
      run : function() {
        console.log('this of run', this); // 로그 추가
        function printValue() {
          console.log(this);
          console.log(this.value);
        }
        (function() {
          printValue();
        });
      }
   }
   ```

   - this of run은 Object를 가리킴

     ![](https://imgur.com/iDKSWYG.png)

   ```javascript
   var obj = {
      value : "codesquad",
      run : function() {
        function printValue() {
          console.log(this);
          console.log(this.value);
        }
        (function() {
          printValue.call(this); // call(this) 메서드 적용
        })();
      }
   }
   obj.run();
   ```

   - printValue()에 대한 call method 를 적용해도 `window` 를 가리킴

   ```javascript
   var obj = {
       value : "codesquad",
       run : function() {
         function printValue() {
           console.log(this);
           console.log(this.value);
         }
         (function() {
           printValue.call(this);
         }.bind(this))();
       }
    }

    obj.run();
   ```

   - bind 를 통해 this 를 할당했으므로, this가 obj를 가리킴



6. ### call - 아직 활용은 그다지 .. 그럼 call 이 필요할 때는 ? (2/2)

   ```javascript
   var obj = (function(value) {
     function print() {
       console.log(this); //window
       console.log(this.value);
     }
     return  {
       value : value,
       print : function() {
        print.call(this); //여기서 call을 사용해보기
       }
     }
   })('crong');

   obj.print();
   ```

   - 파라미터로 변수를 받고, 즉시실행함수에 의해서 실행되는 객체
   - `return` 이 `obj`에 할당이 됨
   - `call` 은 해당 함수를 바로 실행할 때 사용
   - `bind` 는 해당 함수를 나중에 실행해서 binding 할 때 사용



7. ### call 활용 - Object Literal

   자바스크립트는 객체 자체가 `Singleton` 임

   ```javascript
   var youn = {
      name : 'crong',
      getName() {
        return this.name;
      },
      setName(name) {
        this.name = name;
      }
   }
   youn.getName();
   ```

   ```javascript
   var jk = {
      name : 'jk',
      getName() {
        return this.name;
      },
      setName(name) {
        this.name = name;
      }
   }
   ```



8. ### call 활용 - Object Literal (1/2)

   객체를 훔쳐(?) 쓰자. 중복을 제거하기 위해서 call method 사용

   ```javascript
   var youn = {
      name : 'crong',
      getName() {
        return this.name;
      },
      setName(name) {
        this.name = name;
      }
   }
   //jk에 중복된 메서드가 없어졌다.
   var jk = {
      name : 'jk',
   }

   youn.getName.call(jk);
   ```

   `call(jk)` 로 인해서 this 가 jk Object 를 가리킴



9. ### call 활용 - Object Literal (1/2)

   ```javascript
   var util = {
      getName() {
        return this.name;
      },
      setName(name) {
        this.name = name;
      }
   }

   var crong = {
      name : 'crong',
   }

   var jk = {
      name : 'jk',
   }

   util.getName.call(jk);
   ```

   `model(crong, jk)` - `control(util)` 식으로 코드를 구현할 수 있음

   ​

10. ### 객체를 생성해서 사용하는 패턴에서는 ?

    ```javascript
    function Name(){}
    var my = new Name()
    ....
    ```

    `new` 키워드, 생성자 패턴



11. ### call 활용 - Prototype으로 지정 (1/2)

    ```javascript
    var util = function() {
       this.getName = function() {
         return this.name;
       }
       this.setName = function(name) {
         this.name = name;
       }
    }

    function Name(name) {
       this.name = name;
    }

    util.call(Name.prototype);

    var my = new Name("crong");
    my.getName(); //crong.
    ```

    범용성 있는 메소드 (util) 를 만들어놓고

    `util.call(Name.prototype)` 을 이용해서 사용할 수 있음



12. ### call 활용 - Prototype 으로 지정 (2/2)

    ```javascript
    var util = function() {
       this.getName = function() {
         return this.name;
       }
       this.setName = function(name) {
         this.name = name;
       }
    }

    //Name생성자
    function Name(name) {
       this.name = name;
    }

    //Car생성자 추가
    function Car(name) {
       this.name = name || "Ford";
       this.price = 999;
    }
    Car.prototype.getPrice = function() {
       return this.price;
    }

    util.call(Name.prototype);
    util.call(Car.prototype);

    var car = new Car();
    car.getPrice(); //999
    car.getName(); //Ford
    ```

    getPrice는 car 가 가지고 있는 고유한 method



13. ### Call 활용 - Prototype 으로 지정

    ES6의 Classes 를 사용해보자

    ```javascript
    var util = function() {
       this.getName = function() {
         return this.name;
       }
       this.setName = function(name) {
         this.name = name;
       }
    }

    class Car { 
     constructor(price, name) {
        this.price = price;
        this.name = name;
     }
     getPrice() {
       return this.price;
     }
    }

    util.call(Car.prototype);

    var car = new Car(999,"Ford");
    car.getPrice(); //999
    car.getName();  //Ford
    ```

    ​

14. ### 결론

    어떤 문제가 있을 때, this를 바꿔주면서 해결해야 할 때 call 또는 apply를 이용해 해결할 수 있다

    call을 사용해서, 중복을 없애는 부분에서 사용할 수 있다 (함수의 재활용)





