할일 관리 프로그램

Show function 기능

1. all : status를 체크해서 카운된 결과를 출력
2. Status : 입력된 status를 갖는 객체.name을 출력

Show 동작

1. 인자를 받고

2. String 체크 -> All -> (1)기능 수행

   ​                            Status - > (2)기능 수행

(1) 동작

[] -> {} -> {}.status | var "{{status = 0}}" + 1  

------------------------------------

initialize function 

-> data를 status(todo, doing, done)별로 재배열을 하는 역할.

-> todos를 받아서 각 status를 prop로 가지고 value는 key status를 갖는 객체의 리스트인 객체를 리턴.

arrangedByStatusData { 

todo:[{'name' : '자바스크립트 공부하기', tags : ['programing', 'jajvfsdafs']}]

doing : [….]

done : [….]

}



Show function

-> string -> all인지 status인지 check 

if all ->  arrangedByStatusDatad의 각 value의 prop와 갯수를 출력.

if status -> status를 prop으로 갖는 value의 name들을 출력.