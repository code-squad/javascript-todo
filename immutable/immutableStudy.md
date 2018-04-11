###  Why Immutable

이전 상태를 되돌리기가 어렵다.
이전 상태와 현재상태를 유지하면서 동작해야 하는 경우가 존재할 수 있다.
새로운 데이터를 만듬으로써, 데이터의 변경 여부를, 쉽게 판단할 수 있다.(oldData !== newData)
그래서, 변경이 발생할 때마다, 새로운 collection을 만들면 더 좋다.

원본을 다른데서도 참조하고 있으면 상황이 꼬일 수 있는 점 +
데이터를 외부에서 받아온다고 생각해보자 
내 페이스북 user정보를 받아왔다고 해서 거기서 조작을 한다고 하면 계속 같은 데이터를 참조하면 중간 과정을 기록하거나 볼 수 가 없다. 
기능 단위로 생각 -> 
브라우저 뒤로 가기 -> 캐쉬
한 번 실행 후 



### immutable 

immutable js -> why? 
immutable은 생성되면 변할 수가 없다. array,list,fn 등은 reference타입으로 참조를 하고 있으므로 


[미디엄글+_Immutable.js](https://medium.com/@AlexFaunt/immutablejs-worth-the-price-66391b8742d4)
함수형 프로그래밍의 핵심이라고 한다.functional programming

순수함수 Input -> OutPut 

앱에서 Dom조작을 할 떄 -> 변화를 인지해야 되기 때문에 immutable을 쓴다?

input -> output이 분리되므로 data흐름을 추적하기 좋다. 
퍼포먼스 -> memoization을 통해서 performance향상 
ex) [1,2,3,4,5] 5->6으로 바꾸는 것 보다 
[1,2,3,4 ,...6] 요렇게 합쳐주는 것이 더 ? why 바꾸려면 찾아줘야 되는 비용?

```
Simplified data flow through apps.
Removed requirement for defensive copying of data.
Optimisation through data change detection.
Performance enhancement through memoization
```


[why???_immutable](https://stackoverflow.com/questions/34385243/why-is-immutability-so-important-or-needed-in-javascript)

[_immutable_JS_hurt_?](https://softwareengineering.stackexchange.com/questions/304574/does-immutability-hurt-performance-in-javascript)