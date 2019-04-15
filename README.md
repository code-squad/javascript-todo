# todo

```js
//todos.js

const todos =  [ 
                {
                    'name' : '자바스크립트 공부하기', 
                    'tags' : ['programming', 'javascript']
                    'status' : 'todo'
                    'id' : 12123123
                },
                                {
                    'name' : ' 그림 그리기', 
                    'tags' : ['picture', 'favorite']
                    'status' : 'doing'
                    'id' : 312323
                }
                ....
];

const show = (obj) => {
    ...
}

show("all");
show("todo");
```



```js
$ nodejs todos.js

현재상태 :  todo: 1개, doing:2개, done:4개
todo리스트 :  총3건 : ' 자바스크립트 공부하기' , 'iOS공부하기'
```



todos는 object들의 배열로 이뤄져있고, show라는 method는 todos 배열을 조회하는데 있어서 다양한 옵션을 제공해준다.

- `all` : 모든 todos 현재상태를 조회하여 todo, doing, done의 갯수를 알려준다.
- `todo` : status가 todo인 object들만 조회하여 전체 todo의 갯수와 각 todo의 name을 나열해준다.



**수도코드**

```js
// INPUT objStr = 'all', 'todo', 'doing' or 'done'
const show = (objStr) => {
  const props = {}
  let todoSum = todo의 갯수
  let doingSum = doinig의 갯수
  let doneSum = todos의 갯수 - todoSum - doingSum
	
  // 연산 내용 기억하기 위해 object 생성
  props = {'todo' : todoSum, 'doing' : doingSum, 'done' : doneSum}
  
  // all 에 대한 처리
  if (objStr === 'all'){
    console.log(`현재상태 : todo: ${todoSum}개, doing: ${doingSum}개, done: ${doneSum}개`)
    return	// all에 대한 수행이 끝났으므로 함수를 종료
  }
  
  // name들의 배열을 갖고 저장합니다.
  let result = todos.filter(v => v.status === objStr).map(v=>v.name)
  
  console.log(`${objStr}리스트 : 총${props[objStr]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`)
	
  return
}
```



**show()**

```js
const show = (objStr) => {
  let todoSum = todos.filter(v => v.status === 'todo').length
  let doingSum = todos.filter(v => v.status === 'doing').length
  let doneSum = todos.length - todoSum - doingSum
	
  const props = {'todo' : todoSum, 'doing' : doingSum, 'done' : doneSum}
  
  if (objStr === 'all'){
    console.log(`현재상태 : todo: ${todoSum}개, doing: ${doingSum}개, done: ${doneSum}개`)
    return
  }
  result = todos.filter(v => v.status === objStr).map(v => v.name)
  console.log(`${objStr}리스트 : 총${props[objStr]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`)

  return 
}

show('all')
show('todo')
show('doing')
show('done')

// result
// 현재상태 : todo: 4개, doing: 2개, done: 2개
// todo리스트 : 총4건 : 자바스크립트 공부하기, 스위프트 배우기, 리엑트 공부하기, 알고리즘풀기
// doing리스트 : 총2건 :  그림 그리기, 금연하기
// done리스트 : 총2건 : 운동하기, 독서하기
```

