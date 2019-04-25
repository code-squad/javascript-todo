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

