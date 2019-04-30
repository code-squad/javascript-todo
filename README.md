## STEP5-3 : TUNA & YM 리뷰 내용 반영  

#
#### 1. comment : 전체코드의 들여쓰기가 너무 깊은데요? 좋은 indent 가 무엇인지 한번찾아볼래요?

- 전체 코드 indent 수정 : tab 인덴트를 space * 4 로 수정
- 원인 : pair를 위해 구름 ide에서 작업 중, local으로 옮기면서 indent 오반영

원래 ide의 설정은 tab이 space * 4 의 indent로 설정되어 있습니다.
앞으로 들여쓰기가 올바르게 되어있는지, 불편하지 않은지 신경쓰도록 하겠습니다  

#

#### 2. comment : 주석이 필요한.. arguments.length 로 구별하는 방식을 어떻게 개선할 수 있을까요?

- 리뷰 이전  
```javascript
if (argument.length === 3)  // updaste
...
} else if (arguments.length === 2) {  // add, delete
```

- 리뷰 이후 : 의미가 불분명해 주석이 필요했던 if statement 수정  

```javascript
if (command === 'update') { 
  ...	
} else if (command === 'add' || command === 'delete') {  
  ...
}
```  

#
  
#### 3. utils 클래스의 deepCopy 메서드의 이해

- 원래 object.assign으로 얕은 복사를 썼으나, 예상한 방식대로 동작하지 않아 깊은 복사를 지원하는 deepCopy 유틸을 만들었습니다
- 메서드는 검색을 통해 참고했으나, 참조 레퍼런스의 순수한 값만 복사하는 deep copy의 작동 방식은 이해했습니다  

#

#### 4. comment : 시작하는 것은 굳이 class로 만들지 않아도 될거 같아요. 사용일 될 일이 정말 없을 거 같은 부분이기도 하니까요.

```javascript
const RunTodoApp = class {
	constructor() {
		this.cmdArr = ['show','delete','update','add','undo','redo'];
		this.commandParser = new CommandParser();
```

- 프로그램 실행을 담당하는 app.js의 class를 제거한 후, 리팩토링했습니다.  

# 

#### 5. comment : promise패턴을 사용했는데요. then메서드를 사용했을때의 장점은 무엇이라고 생각되세요?

```javascript
 this.utils.delay(0)
 .then(() => {if (cmdList[0] === 'update') return this.utils.delay(3500);})
```

- then메서드를 사용했을 경우, 새로운 프로미스 객체가 반환되어 여러 개의 Promise를 체이닝할 수 있습니다.
- 따라서, 여러 개의 비동기 작업을 수행할 경우, 보다 쉽게 비동기를 제어할 수 있다는 장점이 가장 큰 장점 같습니다.
- error 처리 또한 catch로 손쉽게 할 수 있다는 점도 장점입니다.

#

#### 6. comment : 이부분은 객체리터럴 vs. 클래스! 중 어떤 것이 더 어울릴까요?
```javascript
const CustomException = class {
```
- 에러 처리는 변하는 값이 아닌 특수한 상황에서만 사용되는 고정된 값입니다. 따라서 동적인 인스턴스를 지원하는 class를 사요할 필요 없이
속도가 빠르고 메모리 자원을 낭비하지 않는 리터럴이 적합하다 생각합니다.
