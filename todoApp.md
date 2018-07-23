# 할일관리 애플리케이션



## 1. 학습키워드 정리

### 객체리터럴와 this의 이해

this란: 문맥이 참조하는 **객체**, this는 함수가 불러지는 시점에 결정이 난다. 매번 바뀜. 

함수의 선언문이 호출되는 시점에서의 this는 window이다. 

```
const obj = {
   value : "codesquad",
   run : function() {
     function printValue() {
       console.log(this);
       console.log(this.value);
     }
     (function() {
       printValue();
     }();
   }
}
obj.run() // pintValue()가 실행되는 시점에서 this는 전역객체를 가리킨다.
```

- 왜일까? printValue함수를 감싸고있는 객체가 없기 때문? run함수를 호출할 때 obj.run() 이렇게 obj를 통해 불러야하기 때문에 run함수는 obj{}로 둘러싸였다고 하는 것일까? 나도 잘 모르겠다.



하지만 ES6문법에서 사용되는 arrow function은 조금 다르다.

```
const obj = {
  value : "codesquad",
  run : function() {
    let printValue = () => {
      console.log(this);
      console.log(this.value);
    }
    (function() {
      printValue();
    })();
  }
}
obj.run() // pintValue()가 실행되는 시점에서 this는 obj{}객체를 가리킨다.
```





call: this를 변경하는 메소드

```
function.call(thisArg, arg1, arg2, ...) // function이 가리키는 this가 thisArg로 바뀜!

obj.call(thisArg.prototype) => obj의 prototype까지 다 가져온다.
```

1. 어떤 문제가 있을때, this를 바꿔줘서 문제를 해결한다.

2. 객체를 훔쳐 쓸 수 있다. 중복을 없앨 수 있음



async?

xbind: 

- function(){}.bind()로 쓰일 수 있다. 함수는 object다?
- bind는 비동기일때, 즉시실행함수에서만 사용되나?



### function call과 this











## 2. 설계도

 **요구사항**

다음처럼 동작하는 프로그래밍을 만든다.

할일관리하는 프로그램이며, 다음의 기능이 있다.

- 할일을 추가할 수 있다.
- 할일이 추가되면 id 값을 생성하고 결과를 알려준다.
- 상태는 3가지로 관리된다. todo, doing, done.
- 각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
- 각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
- 명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.

```
command("add$자바스크립트 공부하기");
> id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 출력
> 현재상태 :  todo:1개, doing:2개, done:2개

command("show$doing");
> "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

command("show$done");
> //완료 목록을 위 doing과 같은 형태로 노출한다.

command("update$3$done");
> 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.
```



1. ##### command 함수 생성하기.

    ```
    function command(message) {
        const [accessfn, accessMsg, accessMsg2] = message.split("$");
        if (accessfn === "add") return this.addData(accessMsg);
        else if (accessfn === "show") return this.showData(accessMsg);
        else if (accessfn === "update") return this.updateData(accessMsg2, parseInt(accessMsg));
    }
    ```

    

2. #####currentStateData 객체 만들기.

    ```
    const currentStateData = {
      item: [],
      currentState: {
        todo: 0,
        doing: 0,
        done: 0
      },
    ```

   3. ##### item목록에 할일(todo)를 추가해주는 add 함수

    ```
    add(taskName) {
      const startingIDVal = 1;
        const taskNameLength = this.item.length + startingIDVal;
        const dataSample = {
          id: taskNameLength,
          taskName: taskName,
          state: "todo",
        };
        const showId = dataSample.id;
        const showTaskName = dataSample.taskName;
        this.item.push(dataSample);
        this.currentState.todo++
        console.log("현재 상태:", this.currentState);
        return `id: ${showId}, "${showTaskName}" 항목이 새로 추가됐습니다.`;
    }
    ```


​    

4. #####원하는 item데이터(todo, doing, done)를 보여주는 show함수

   ```
   showData(state) {
       const showMessage = this.item.filter(element => element.state === state);
       return showMessage;
   }
   ```



소요시간계산 STEP2

**요구사항**

완료 상태가 되면, 진행중부터 완료까지 소요된 시간을 알 수 있으면 좋겠다. 예를들어 공부하기라는 task가 얼마나 걸렸는지 알고 싶을 수 있다. 이때 시간단위로 몇시간 걸렸는지 알 수 있게 날짜를 기반으로 시간을 계산해보자.

```
> "show$done";
> 'iOS공부하기, 3시간10분', '자바스크립트공부하기, 9시간31분', '주간회의 1시간40분'
```

이런식으로 task가 doing => done까지의 소요시간을 계산해서, 출력하도록 한다.힌트날짜나 시간을 활용하기 위해서는 자바스크립트 date객체를 활용할 수 있다.

```
const time = new Date(); 
console.log(time); 
console.log(time.getHours); 
console.log(Date.now());  
//밀리세컨드단위로 시간의 차이를 계산할때 유용하다.
```

참고 : <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date> 



1. 어떤 task에 대한 state가 doing으로 바뀌는 시점에서 시간을 저장한다.

   state가 todo => doing으로 update되는 시점에서 시간을 저장해준다.

   => update()함수가 실행될때, 함수 안에 startingTime()함수가 불려지도록한다.

   =>startingTime()함수는 현재 시간을 어떠한 변수에 저장을하고, item안에 새로운 데이터르 생성해준다.

   ```
       const startingTime = Date();
   ```

   

   ```
   const time = Date();
   ```

   

2. 다시 state가 doing에서 done으로 바뀔때, 현재 시점에서 시작 시점의 시간을 빼준다. => 소요시간



ES6 Classes 적용 STEP4

**요구사항**

객체리터럴로 된 코드를 다시한번 ES6의 Class문법에 따라서 변경해본다. 아래코드와 같이 동작되도록 한다.

```
const Health = class {
	constructor(name,healthTime) {
    	this.name = name; this.healthTime = healthTime; 
    	} 
    showHealth(){
    	debugger; console.log(this.name + "님, 오늘은 " + this.healthTime + "에 운동을 하셨네			요"); 
    } 
} 
const ho = new Health("crong", "12:12"); 
ho.showHealth(); 
```

mdn의 ES6 Class를 활용해서 한다. 불필요한 상속구조는 하지 않는다.



**class, 메소드, 속성, 인스턴스는 무엇인가**

- class

  - 일반화할 수 있는 어떤 것. 하나의 역할이 있다.(ex> 로그인을 한다.)

  -  클래스는 다시 사용할 객체를 찍어내는 틀??
  -  클래스 간에도 서로 협력이 가능하다. 클래스 의 메소드가 다른 클래스의 메소드를 부를 수 있다. 객체와 객체는 서로 데이터를 통신할 수 있는 인터페이스가 필요하다. 

- method

  - 클래스 안의 함수들

- property(속성)

  - 객체 속에서 어떠한 값이 할당된 자료형태

- instance(object)

  - 객체라고 이해해야하나..

  - 객체 인스턴스

     ```
     ex) 
     class object {
         ~~
     }
     let a = new object()
     ```

      ==> 여기서 **a**가 instance다

클래스의 메소드는 모든 객체와 공유해야하기 때문에 프로토타입 객체 안에 저장한다.

**클래스는 왜 필요한가(언제 만드냐)**

- 비슷한 역할을 하는 객체를 위해. (로그인이라는 클래스를 만들어서 재 사용하는 것)

**클래스는 함수와 뭐가 다른가**

- 하나의 역할을 가진다는 공통점이 있다.
- 함수는 반환값이 필요하지만, 객체는 반환값이 필요하지 않다.

프라이빗, 퍼블릭 메소드(todo의 커맨드 메소드)??