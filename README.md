# todoList

할일관리 어플리케이션을 제작한다.

* `TodoList.command`키워드를 통해 접근한다
* 인자는 문자열로 넘겨준다
  * `TodoList.command(add$자바스크립트 공부)`
* flag와 detail은 `$`로 구분한다
* add : 할 일을 삽입한다
  * add$자바스크립트 공부
  * 삽입 후 각 상태 별 할 일 개수를 출력한다
* show : 해당 상태의 할일들을 보여준다
  * show$done
  * done 키워드를 입력하면 doing부터 done상태의 시간을 기록하여 출력한다.
* update : 해당 id의 status를 변경한다
  * update$1$doing : id가 1인 할 일을 doing 상태로 변경
  * 업데이트 후 각 생태 별 할 일 개수를 출력한다
