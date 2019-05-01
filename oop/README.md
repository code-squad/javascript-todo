# Step 5 OOP

## Step 5-2

### 디렉토리 구조

- `main.js` : 프로그램 진입점. 사용자의 명령을 받아 처리하는 로직이 존재함.
- `parser.js` : 파싱을 위한 클래스로 생성자에 받은 구분자로 문자열을 분리함. 구분자가 없을 때 `exception`을 던짐.
- `todoParser.js` : `Parser` 클래스의 기능을 사용하면서 명령어와 인자를 검증하는 예외 처리가 포함됨. 
- `todoApp.js` : `TodoParser` 가 반환한 명령어를 받아 `todo` 객체에 대한 `CRUD` 를 수행함. 존재하지 않는 id나 update로 변경되는 내용이 없을 때의 예외 처리는 이곳에서 하게 됨.
- `todo.js` : 할 일을 추상화한 객체 클래스.
- `test.sh` : 테스트를 실행하는 스크립트. 관련된 파일 목록은 다음과 같다.
  - `testcase/test.in` : 프로그램의 명령어를 한 줄 씩 나열하여 저장함.
  - `todoList.js` : 프로그램 실행 시 로드하게 될 `todo` 객체의 배열이 존재함

### 테스트

```console
oop $ sh test.sh
```

## Step 5-3

### 리팩토링

- 고차함수 `groupBy`와 `count` 생성: SQL의 groupBy, count 와 유사하게 동작하는 함수를 구현하여 출력 함수의 내부 구현을 단순하게 변경.
- `Parser` 클래스 변경: prototype 패턴으로 변경함. Parser의 프로토타입 함수는 `call` 함수로 바인딩하여 호출함.



### Undo, Redo 구현

- `TodoContainer` 클래스: Show를 제외한 다른 명령어를 실행하면 `TodoApp` 객체가  `TodoContainer` 객체의 명령어에 대응하는 메소드를 호출하고, `TodoContainer` 객체는 `Todo` 객체를 담은 배열을 조작하거나 배열 내부의 특정 `Todo` 객체를 변경하도록 구현했다. 배열 또는 `Todo` 객체를 조작하면서 변경된 부분은 `TodoContainer` 내부의 히스토리를 저장하는 배열에 집어넣도록 구현하였다. 
- `DiffState` 클래스: `Todo` 객체를 담은 배열을 조작할 때, 어떤 점이 변경되는지를 나타내는 클래스이다. Create, delete 시에는 추가되거나 삭제되는 객체의 주소를 복사하여 가지고 있고, update 시 변경되는 프로퍼티와 값을 가지고 있다.