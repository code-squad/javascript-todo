#  Javascript 질문에 대답해보기



### 비트연산자 보수이해하기
#####  10을 2진표현으로 변경하려면 어떤 순서로 계산해야 하는지 설명하기.
* 몫이 1이 될 때까지  10을 2로 나눠, 나머지 값은 나열하면 이진표현으로 표시됩니다.
  * (10%2) === 0
  * 5 % 2 === 1
  * 2 % 2 === 0
  * 1
  * : 1010(2)



### hoisting 에 대해서 설명하기

* 후선언된 변수나 함수들이 해당 스코프의 최상위 위치로 끌어 올려지는 것을 의미합니다. 
* Javascript 엔진은 Runtime 시점에서 변수 선언문이나 함수 선언문을 읽기 전에, (선언된) 변수와 함수를 먼저 읽어 해당 스코프의 최상위에 위치시킵니다. 따라서, 훨씬 뒤에서 선언된 함수들과 변수들을 그보다 전에 사용할 수 있게 됩니다.





### !! 은 무엇을 의미하는가? 어떻게 활용할 수 있을까?

* !! 연산자는 확실한 논리결과를 도출해야 할 경우 사용합니다.
* 즉, !!를 사용하면 0, null, undefined 등과 같은 정의 되지 않은 변수들을 논리 연산 시에 Boolean값인 true / false로 나타나도록 강제 변환합니다.





### 3개이상의 switch 문을 어떻게 3항연산자로 대체할 수 있을까? 코드로 예시를 들라.

```javascript
  switch (new Date().getDay()) {
      case 0:
          day = "Sun";
          break;
      case 1:
          day = "Mon";
          break;
      case 2:
          day = "Tue";
          break;
      case 3:
          day = "Wed";
          break;
      case 4:
          day = "Thu";
          break;
      case 5:
          day = "Fri";
          break;
      case 6:
          day = "Sat";
  }
```

```javascript
  var DAY;
  var getDay = new Date().getDay()

  getDay === 1 ? day = "Mon" :
  getDay === 2 ? day = "Tue" :
  getDay === 3 ? day = "Wed" :
  getDay === 4 ? day = "Thu" :
  getDay === 5 ? day = "Fri" :
  getDay === 6 ? day = "Sat" : day = "Sunday"

  console.log(day);
```



### ==와 ===의 차이는 정확히 무엇인가?

* `==`는 Equal Operator라고 부르며, '값'을 비교해서 맞으면 Ture, 틀리면 False를 반환합니다. `===`은 Strict Equal Operator라고 부르며, 기존 Equal Operator 연산자보다 엄격한 연산자입니다. `===`는 '값'과 '타입'을 모두 비교합니다. 이 또한 맞으면 True,  틀리면 False를 반환합니다.

  ​

### `const value = a || b;`  코드의 의미는 무엇인가?

```javascript
const value = a || b;
// const : ES2015에서 추가되었습니다. 상수 값을 사용하여 블록 범위 변수를 선언합니다.
// var문이 function-scoped로 Hoisting이 일어났다면, 
// const문은 block-scoped로 Hoisting이 일어납니다. 
// 또한 상수의 값은 재할당을 통해 바뀔 수 없고 재선언될 수 없습니다.

// value = 선언 중인 상수의 이름입니다.
// const value = a || b : 상수값 value는 a가 true이면 a를 선언하고, false이면 b를 선언한다는 문장입니다.
```



### eval 은 무엇인가? 

  - String 형태의 자바스크립트 코드를 동적으로 실행할 수 있도록 바꿔주는 함수입니다.

```javascript
var dateFn = "Date(2017,5,30)";
var myDate;

eval("myDate = new " + dateFn + ";");  // 2017-06-29T15:00:00.000Z
```




### 변수값을 출력할때 null, undefined, is not defined으로 출력되는 차이점은 무엇인가? 

  - `null`:  사용자가 변수를 선언하고 `null`이라는 빈 값을 할당했을 때 출력됩니다.
  - `undefined` : 사용자가 변수를 선언 하고, 값을 할당하지 않았을 때(즉, 자료형이 결정되지 않은 상태) 출력됩니다. 
  - `is not defined`: 사용자가 변수를 선언하지 않았을 때 출력됩니다. 

  ​

### `Function.prototype.bind` 에 대해서 설명하기

* 함수객체는 실행 시점에서 execution context 를 생성하며 현재의 실행 코드 범위를 뜻하는 this를 할당합니다. 하지만 this 를 동적으로 할당해야 하는 경우가 있습니다. 특히 다양한 객체에서 동적으로 특정 액션을 할당하여 사용되는 함수의 경우 this 에 할당되는 객체를 예측하기가 힘듭니다. 
* 이럴때 bind를 이용하여 실행 시점에서  context의  this 를 임의로  할당해 주어 동적인 호출시에도 오류 없이 코드가 동작하게 할수 있다.  [출처](http://insanehong.kr/post/front-end-developer-interview-javascript/)



### this가 가리키는 건 언제 결정되는가?

* 해당 함수가 불려질 때 this가 가리키는 것이 변경될 수 있으며, 그때 this가 가리키는 것이 결정됩니다.



### call과 apply의 차이점은?

* 이들은 호출의 동적인 변화에 따라 각각 다르게 되는데, 정적인 호출인 경우 `call`을, 동적인 호출에서는 `apply`를 사용하게 된다. 즉, 호출 시 동적인 인자전달등이 필요할 경우 `apply`를, 정적으로 고정된 함수를 호출할 경우 `call`을 사용하면 된다. [출처](http://insanehong.kr/post/front-end-developer-interview-javascript/)


### add(10)(2) //12 가 되도록 구현해보기 

```javascript
const add = (a) => {
  return (b) => {
    return a + b;
  };
}
console.log(add(10)(2));
```

### 함수의 인자갯수와 파라미터가 일치하지 않으면 어떤일이 생기는가 설명하기

* 함수의 인자갯수보다 적게 함수를 호출했을 경우, 넘겨지지 않은 인자는 undefined 값이 할당되며, 인자 갯수보다 많게 호출했을 경우에는 에러가 발생하지 않고, 초과된 parameter는 무시됩니다.

### 함수의 반환값이 없을때 어떻게 되는가?

* undefined가 반환됩니다.


### 익명함수는 무엇인가? 

* 이름이 없는 함수를 말합니다. 익명함수를 사용하기 위해서는 함수표현식을 사용해야, 람다함수와 즉시실행함수를 생성할 수 있습니다.즉 익명함수는 동적으로 할당되는 유효범위를 가지기 때문에, Javascript 내에서 강제적인  유효범위 설정을 하는 경우 익명함수를 사용합니다. [출처](http://insanehong.kr/post/front-end-developer-interview-javascript/)