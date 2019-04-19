let saveArray = [];

function makeObjectList(name, tag, status, id) {
   this.name = name;
   this.tag = [tag];
   this.status = status;
   this.id = id;
}


let hash = (string) => {
   let hash = 0;
   for(let i=0; i<string.length; i++) {
       hash += string.charCodeAt(i);
   };
   return hash;
};

function todoShow (input) { 
   let showWhat = input[0];
   showWhat === 'all' ? todoShowAll() : todoShowElse(showWhat)
}

function setTimeShowList()  {
    setTimeout(todoShowAll, 1000);
}

function todoShowAll() {
   let allList = {
       'todo' : [],
       'doing' : [],
       'done' : []
   };

   saveArray.forEach((list) => { 
       if (list['status'] === 'todo') {
           allList.todo.push(list['name']);
       } else if (list['status'] === 'doing') {
           allList.doing.push(list['name']);
       } else {
           allList.done.push(list['name']);
       }
   })

  console.log(`현재상태 : todo: ${allList.todo.length}개, doing: ${allList.doing.length}, done: ${allList.done.length}`);
}

function todoShowElse(status) {
    result = saveArray.filter(v => v.status === status).map(v => v.name);
  console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
   setTimeShowList();
}


function todoAdd (input) {
    let [name, tag] = input;
    let newTodo = new makeObjectList(name, tag, status='todo', hash(input[1]))
    saveArray.push(newTodo);
    console.log(saveArray);
    setTimeShowList();
}

function todoDelete (input) {
    let id = parseInt(input[0]);  // filter, findIndex로 변경가
    for ( let i = 0; i < saveArray.length; i++) {
        if (saveArray[i]['id'] === id) {
            saveArray.splice(i,1)
        }
    }
    console.log(saveArray);
    setTimeShowList();
}

function todoUpdate (input) {
    let [id, status] = input;
    id = parseInt(id);
    saveArray.forEach(element => {
        if(element['id'] === id) {
            element['status'] = status;
        }
    })
    console.log(saveArray);
    setTimeout(todoShowAll,3000);
    }




exports.todoMain = (answer) => {
        let tempArr = answer.split(',');
        let action = tempArr.shift(0)
        if (action === 'add') {
            todoAdd(tempArr);
        } else if (action === 'delete') {
            todoDelete(tempArr);
        } else if (action === 'update') {
            todoUpdate(tempArr);
        } else {
            todoShow(tempArr);
        }
    }
