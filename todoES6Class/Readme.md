ES6 Classes 적용.
요구사항
객체리터럴로 된 코드를 다시한번 ES6의 Class문법에 따라서 변경해본다.

아래코드와 같이 동작되도록 한다.

```

const Health = class {
  constructor(name,healthTime) {
    this.name = name;
    this.healthTime = healthTime;
  }

  showHealth(){
     debugger;
     console.log(this.name + "님, 오늘은 " + this.healthTime + "에 운동을 하셨네요");
  }

}
```

const ho = new Health("crong", "12:12");
ho.showHealth();
mdn의 ES6 Class를 활용해서 한다. 불필요한 상속구조는 하지 않는다.


### 설계

