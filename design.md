### 필요한 것:
1. show함수
2. todos 데이터

### show 함수의 기능:
1. 'all'을 인자로 받았을 때
반환 => 현재상태 : todo x개, doing x개, done x개
2. 'todo' 를 인자로 받았을 때
반환 => 총 x건: '0000하기', '000공부', '000먹기'

### 코딩 설계
- parameter가 'all' 일때
    => []의 { } 안에 key 'status'를 찾아서 'todo', 'doing', 'done'으로 나눠 각각 변수에 카운팅 한 후 스트링 메시지 안에 숫자 값만 넣어 반환(filter 사용가능할듯)

- parameter가 'todo' 일때
    => []의 { } 안에 key 'name'을 찾아서 새[]에 push후 arr length를 개수로 넣고 join하여 스트링 메세지에 삽입하여 반환(reduce 사용가능할듯)


### 2차 코딩 설계
 - parameter가 'all', 'todo', 'doing', 'done' 일때 if로 구분하지말고 recude함수에서 인자의 종류에 따라 해당하는 횟수와 리스트를 한번에 작성해내기
 - reduce에서 초기값을 []로 설정하고 매 callback함수를 return 하기전에 객체에 'todo', 'doing', 'done'의 횟수를 카운팅한다.
 - reduce가 끝나면 인자에 해당하는 결과값은 완성이 되고 함수의 마지막에 그 값을 console.log해준다. 

