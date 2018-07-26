# 할 일 관리 애플리케이션

## 1. 목표

할 일을 관리하는 프로그램이며, 다음과 같은 기능이 있다.

- 할 일을 추가할 수 있다.
- 할 일이 추가되면 id 값을 생성하고 결과를 알려준다.
- 상태는 3가지로 관리된다. todo, doing, done.
- 각 일(task)은 상태 값을 가지고 있고, 그 상태 값을 변경할 수 있다.
- 각 상태에 있는 task는 show 함수를 통해서 볼 수 있다.
- 명령어 입력 시 command 함수를 사용해야 하고, '$'를 구분자로 사용해서 넣는다.
- show$done 일 때 doing => done까지의 소요시간을 계산해서 보여준다.

```javascript
command("add$자바스크립트 공부하기");
> id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. //추가된 결과 메시지를 출력
> 현재상태 :  todo:1개, doing:2개, done:2개

command("show$doing");
> "1, 그래픽스공부", "4, 블로그쓰기" //id값과 함께 task제목이 출력된다.

command("show$done");
> "1, 그래픽스공부, 1시간 40분", "4, 블로그쓰기, 3시간 13분" //소요시간이 함께 출력된다.

command("update$3$done");
> 현재상태 :  todo:1개, doing:1개, done:3개 //변경된 모든 상태가 노출.
```

## 2. 계획

- [x] 데이터 정의하기
  - [x] 할 일 객체 클래스 만들기
- [x] 할 일 추가 기능 만들기
  - [x] 입력 문자열 분석 기능
  - [x] add 함수 만들기
  - [x] add 결과 출력
  - [x] 현재상태 데이터 만드는 함수 만들고 출력
- [x] 각 상태 항목 보여주는 기능(show) 만들기
  - [x] show 함수 만들기
- [x] task의 상태를 변경하는 update 기능 만들기
  - [x] update 함수 만들기
- [x] command에서 명령어 예외처리 하기
- [x] done 소요시간 계산 및 출력 기능 만들기
  - [x] 할 일 객체에 상태 등록 시간 속성 추가
  - [x] 소요시간 계산 기능
  - [x] 소요시간 출력 기능

## 3. 설계

### 3.1. 데이터 설계

* 할 일 데이터 리스트
  - id, title, state, saveTime 속성을 가진 객체들의 리스트
  - class를 이용해 필요할 때 동적으로 생성

```javascript
const task = [{
  id: 1,
  title: '자바스크립트 공부하기',
  state: 'todo',
  saveTime: '등록시간'
}];
```

* 상태 데이터
  - todo, doing, done이 있다.
  - 상태 추가 및 이름 변경 가능
  - 이 데이터를 기준으로 상태 통계 데이터가 만들어진다.

```javascript
const stateList = ['todo', 'doing', 'done'];
```

* 현재 상태 통계 데이터
  - 필요한 상황에 동적으로 만들어 사용
  - 상태 데이터 배열을 기준으로 속성이 만들어진다.

```javascript
const stateCount = {
  todo: 1,
  doing: 0,
  done: 0
};
```

### 3.2. 기능 설계

- command 함수

```javascript
function command(cmdStr) {
  // 1. 입력받은 문자열을 파싱한다.
  // 2. 각 조건에 맞는 명령을 수행한다.
  // 3. 조건에 맞지 않는 명령어는 에러메세지를 출력한다.
}
```

- 문자열 파싱하는 함수

```javascript
function parseCmdStr(cmdStr) {
  // 1. 구분자 '$'로 끊어서 배열로 만든다.
  return resultArr;
}
```

- 할 일을 등록하는 함수

```javascript
function addTask(taskName) {
  // 1. 할 일 객체를 만든다.
  // 2. id 값과 현재 시간을 구한다.
  // 3. 할 일 객체를 배열에 추가한다.
}
```

- 상태 통계 객체를 만드는 함수

```javascript
function getStateCount() {
  // 1. 이미 존재하는 상태 통계 데이터가 있는지 확인하고
  // 2. 없다면 상태 데이터를 기준으로 상태 통계 데이터를 만든다.
  // 3. 있다면 상태 통계 데이터를 모두 0으로 초기화 한다.
  // 4. 각 상태의 개수를 카운트한다.
}
```

- 상태 통계 데이터를 포맷에 맞춰 출력하는 함수
```javascript
function showStateCount() {
  // 1. 상태 통계 데이터를 포맷에 맞춰 출력한다.
}
```

- 입력받은 특정 상태를 가진 값들을 찾아 보여주는 함수

```javascript
function showTasksByState(state) {
  // 1. 입력받은 state 해당하는 task와 task의 id를 찾는다.
  // 2. 출력 포맷에 맞게 출력한다.
  // 3. task에 소요시간 항목이 있으면 같이 출력한다.
}
```

- 입력받은 task의 상태를 변경하는 함수

```javascript
function updateTaskState(taskId, state) {
  // 1. taskId에 해당하는 아이템을 찾아 state값을 변경한다.
  // 2. 상태가 변경된 시점(현재)로 saveTime을 업데이트 한다.
  // 3. state값을 done으로 변경시 해당 task에 소요시간을 계산하여 추가한다.
}
```

- task의 등록시간을 갱신하는 함수

```javascript
function updateTaskTime(task, newTime) {
  // 1. task의 등록시간을 새로운 현재 시간으로 갱신한다.
  // 2. task의 상태가 done으로 업데이트 됐을 경우 소요시간을 구한 후 소요시간 항목을 추가한다.
}
```

- 소요시간 구하는 함수

```javascript
function getTimeTaken(startTime, endTime) {
  // 1. 시작시간과 종료시간의 차이를 구한다.
  // 2. 일, 시간, 분, 초의 형식으로 데이터를 만들어 반환한다.
  return timeTaken;
}
```

- 소요시간 출력 메세지를 만드는 함수

```javascript
function getMsgTimeTaken(timeTaken) {
  // 1. 일, 시간, 분, 초 각 데이터의 존재 유무에 따라 출력메세지를 만든다.
  return msgTimeTaken;
}
```

- 영어 시간 단위를 한글로 바꿔주는 함수

```javascript
function getKoTimeUnit(enTimeUnit) {
  // 1. day, hour 등 영어로 된 시간 단위를 한글로 바꿔서 반환한다.
}
```