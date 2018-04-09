# Immutable Collection 조작

데이터의 상태를 직접 변경하지 않고, 새로운 데이터로 만들어서 데이터를 업데이트 하는 방법을 안다

- ### 데이터 변경 방법에 대한 고민

  Javascript 에는 Array와 Object 라는 데이터를 다루는 Collection 이 존재하며,

  어떤 이유로 삭제/변경/추가 등 다양한 변경이 발생할 수 있음

  Collection의 상태를 변경해야 한다면

  1. 직접 상태를 변경
  2. **이전 상태를 보관해두고 새로운 Collection을 만든다**

  보통은 1번을 선택함

  배열과 객체에 새로운 속성이나 데이터를 넣는것은 당연함

  하지만 단점들이 존재함

  - **이전 상태**를 되돌리기 어려움
  - 이전 상태와 현재 상태를 유지하면서 동작해야 하는 경우가 존재함
  - 새로운 데이터를 만듬으로써, **데이터의 변경여부**를 쉽게판단할 수 있음
    (oldData !== newData)

  그래서, 변경이 발생할 때 마다 **새로운 Collection을 만들면 더 좋다**



- ### Mutable

  이미 만들어진 상태를 변경하는 것

  `Array`와 `Object`는 `Mutable`

  ```javascript
   const myData = [ 
                   {name:"crong", phoneNumber:"010-111-3333"},
                  {name:"jk", phoneNumber:"010-001-3433"}
                  ];

  //data추가.
  myData.push({name:"honux", phoneNumber:"070-142-0000"});
  console.log(myData.length === 3);//true
  ```

  앞서 설명했듯이 **이전상태를 되돌릴 수 없음**



- ### Immutable (변경할 수 없는)

  ```javascript
   const myData = [ 
                   {name:"crong", phoneNumber:"010-111-3333"},
                  {name:"jk", phoneNumber:"010-001-3433"}
                  ];

  //data추가.
  const newData = myData.concat({name:"honux", phoneNumber:"070-142-0000"});
  console.log(myData.length, newData.length); //2,3
  console.log(myData === newData); //false
  ```

  이전 상태가 기억되고 있음

  새로운 array는 이전 array와 **완전히 다른 객체**임 (참조 지점이 다름)

  immutable 객체 = myData

  myData를 immutable 객체로 취급하려면

  데이터의 변경(추가/삭제/수정)이 발생했을 때

  **새로운 배열**을 만들도록 하면 된다

  `Concat 메서드`는 immutable이 가능한 Array의 표준 메서드

  ```javascript
   const myData = [ 
                   {name:"crong", phoneNumber:"010-111-3333"},
                  {name:"jk", phoneNumber:"010-001-3433"}
                  ];

  //data추가.
  const newData = [...myData, {name:"honux", phoneNumber:"070-142-0000"}];
  console.log(myData.length, newData.length); //2,3
  console.log(myData === newData); //false
  ```

  위의 코드에서는 `Spread Operator`를 사용함 (간편한 방법)

  `concat`은 **새로운 배열을 반환**하는 메서드

  대표적으로 [slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 메서드도 존재



- ### Immutable - object

  객체를 immutable 로 동작하게 해보자

  ```javascript
  const crongObj = {name:"crong", phoneNumber:"010-111-3333"};
  crongObj.phoneNumber = "010-111-4444";
  console.log(crongObj);
  ```

  존재하는 객체를 직접 수정

  immutable로 변경하면 다음과 같이 할 수 있음

  ```javascript
  const crong = {name:"crong", phoneNumber:"010-111-3333"};
  const newCrong = Object.assign({}, crong, {phoneNumber:"010-111-4444"});
  console.log(crong, newCrong);
  ```

  `Object assign`은 존재하는 객체에 속성을 업데이트 해주는 역할을 담당

  `assign` 메서드의 첫번 째 인자 ({}) 로 들어간 빈 객체는 새로운 객체를 선언한 것과 같음

  이후 crong 객체를 추가함

  동일한 속성이 있다면 그것만 업데이트함

  > {} 에 crong 객체를 업데이트

  이후 세번 째 인자 `({phoneNumber : "010-111-4444"})` 역시 동일하게 동

  작

  따라서, crong 객체의 속성이 포함된 새로운 객체에 `phoneNumber` 속성이 **업데이트**됨

  > crong 속성이 반영된 새로운 객체에 phoneNumber 속성을 업데이트

  ​

- ### Immutable - object in array

  배열안에 객체가 있는 구조를 immutable로 동작하게 하려면?

  crong 배열의 3번 째 원소의 phoneNumber 를 변경해야 한다면?

  ```javascript
  const crong = [
     {name:"jk", phoneNumber:"010-111-1111"}, 
     {name:"honux", phoneNumber:"010-222-2222"}, 
     {name:"crong", phoneNumber:"010-333-3333"}
  ];

  const newCrong = [...crong.slice(0,2), Object.assign({}, crong[2], {phoneNumber:"010-111-4444"})]

  console.log(newCrong);
  ```

  `spread operator` `slice method` `Object.assign method`

  `Object.assign`

  ```javascript
  const crong = [
     {name:"jk", phoneNumber:"010-111-1111"}, 
     {name:"honux", phoneNumber:"010-222-2222"}, 
     {name:"crong", phoneNumber:"010-333-3333"}
  ];

  const newCrong = Object.assign(
          [...crong], 
          {2 : Object.assign(
                  {}, 
                  crong[2], 
                  {phoneNumber:'010-444-4444'}
          )}
  );

  console.log(newCrong);
  ```

  위와같이 처리할 수 있지만 조금 불편함 :(

  일반화된 함수로 구현할 수 있지 않을까?

  ​

- ### 기타, immutable 조작을 위한 유용한 것들

  reduce 메서드가 도움을 줄 수 있다

  spread operator for objects !!! (브라우저 지원범위가 상대적으로 낮음)

  immutable.js

  ​





















