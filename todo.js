'use strict'

const todo = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add task addition method
    todoList : [],
=======
    todoList : [
        {id: 13, name: '자바스크립트 공부', status: 'todo', tag: 'programming'},
        {id: 17, name: 'iOS 공부', status: 'todo', tag: 'programming'},
        {id: 21, name: 'Closure 공부', status: 'done', startTime: '00:00', endTime: '12:01', tag: 'programming'},
        {id: 18, name: '여행가기', status: 'doing', startTime: '04:19', tag: 'play'}
        ],
=======
    todoList : [],
>>>>>>> Improve todoPrint.showTasksByTag method to print tasks under specific tag
    
>>>>>>> Add todoPrint.showTasksByTag method for printing all tasks after grouping them with same tags
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}) {
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.countOfStatus.todo++;

<<<<<<< HEAD
<<<<<<< HEAD
        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const {name: targetTaskName, status: currentStatus} = targetTask;
        
        targetTask.status = newStatus;
        this.countOfStatus[currentStatus]--;
        this.countOfStatus[newStatus]++;

        this.printUpdateResult('update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}) {
        const {name, status} = this.todoList[id-1];
        delete this.todoList[id-1];
        this.countOfStatus[status]--;

        this.printUpdateResult('remove', {taskId: id, taskName: name});
    },
    printUpdateResult(actionType, {taskId, taskName, prevStatus, nextStatus}) {
        const countOfTasksPerStatus = `현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;

        if (actionType === 'add') {
            console.log(`id: ${taskId} "${taskName}" 항목이 새로 추가됐습니다.\n${countOfTasksPerStatus}`);    
            return
        } 
        if (actionType === 'update') {
            console.log(`id: ${taskId} "${taskName}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.\n${countOfTasksPerStatus}`);
            return
        } 
        if (actionType === 'remove') {
            console.log(`id: ${taskId}, "${taskName}" 항목 삭제 완료`);
            return
        }
    }
};

const todoPrint = {
    showTasksByTag(tag) {
        let resultStr = '';
        const resultObj = {};
            
        if(tag) {
            const targetTag = tag.toLowerCase();
             // Group tasks by status
            for (let task of todo.todoList) {
                if (task.tag !== targetTag) continue;
                if (!resultObj[task.status]) resultObj[task.status] = [];
                resultObj[task.status].push(task);
            }
            // Add task info into resultStr for tasks in object created above
            for (let status of Object.keys(resultObj)) {
                resultStr += `${(resultStr) ? `\n\n` : ''}[ ${status} , 총 ${resultObj[status].length} 개 ]`;
                for (let task of resultObj[status]) {
                    resultStr += `\n- ${task.id}번, ${task.name}`
                    if(status === 'done') { resultStr += ` ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); } 
                }
            }
        } else {
            //Group tasks by tags
            for (let task of todo.todoList) {
                if (!task.tag) continue; 
                if (!resultObj[task.tag]) resultObj[task.tag] = [];
                resultObj[task.tag].push(task);
            }
            // Add task info into resultStr for tasks in object created above
            for (let tagName of Object.keys(resultObj)) {
                resultStr += `${(resultStr) ? `\n\n` : ''}[ ${tagName} , 총 ${resultObj[tagName].length} 개 ]`;
                for (let task of resultObj[tagName]) {
                    resultStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`
                }
            }
        }

        return resultStr
    },
    showTasksByStatus(status) {
        let resultStr = '';
        const resultObj = {};

        if(status) {
            const targetStatus = status.toLowerCase();
             // Group tasks by satus
             for (let task of todo.todoList) {
                if (task.status !== targetStatus) continue;
                if (!resultObj[task.status]) resultObj[task.status] = [];
                resultObj[task.status].push(task);
            }
             // Add task info into resultStr for tasks in object created above
             for (let task of resultObj[targetStatus]) {
                resultStr += `${(resultStr) ? `\n` : ''}- ${task.id}번, ${task.name}, [${task.tag}]`
                if(targetStatus === 'done') { resultStr += `, ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); } 
            }
        } else {
            /*
            
            >  todo.showAll();   //  모든 리스트를 지연출력.  'todo', 'done'도 역시 아래와 같은 형태와 방식으로 출력되어야 함.
            "총 7개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다....."
            [ todo , 총3개 ]
            - 13번, 자바스크립트공부, [programming]
            - 17번, iOS공부, [programming]
            - 18번, 여행가기, [play]

            "지금부터 3초뒤에 doing내역을 출력합니다...."
            [ doing , 총2개 ]
            - 14번, 블로그쓰기, [other]
            - 10번, 알고리즘공부

            "지금부터 2초뒤에 done내역을 출력합니다....."
            [ done , 총2개 ]
            - 20번, 휴대폰수리, [other], 1시간1분
            - 21번, closure공부, [programming], 1일 23분
            */
        }
        
        return resultStr
    },
    applyPrintableTimeFormat(timeInMs) {
        let timeSpentStr = '';

        const daysSpent = parseInt(timeInMs/1000/60/60/24);
        const hoursSpent = parseInt(timeInMs/1000/60/60) - (daysSpent * 24);
        const minutesSpent = parseInt(timeInMs/1000/60) - (daysSpent * 24 * 60) - (hoursSpent * 60);
        
        if (daysSpent) timeSpentStr += `${daysSpent} 일`;
        if (hoursSpent) {timeSpentStr += (timeSpentStr) ? ` ${hoursSpent} 시간`: `${hoursSpent} 시간`}
        if (minutesSpent) {timeSpentStr += (timeSpentStr) ? ` ${minutesSpent} 분`: `${minutesSpent} 분`}

        return timeSpentStr
    }
};

// Test cases
todo.todoList.push(
    {id: 13, name: '자바스크립트 공부', status: 'todo', tag: 'programming'},
    {id: 17, name: 'iOS 공부', status: 'todo', tag: 'programming'},
    {id: 21, name: 'Closure 공부', status: 'done', startTime: 1537838429530, endTime: 1537926397371, tag: 'programming'},
    {id: 18, name: '여행가기', status: 'doing', startTime: '04:19', tag: 'play'}
);

console.log(`\n 모든 태그 출력 \n` + todoPrint.showTasksByTag());
//> [ programming , 총 3 개 ]
//- 13번, 자바스크립트 공부, [todo]
//- 17번, iOS 공부, [todo]
//- 21번, Closure 공부, [done]
//
//[ play , 총 1 개 ]
//- 18번, 여행가기, [doing]

console.log(`\n 특정 태그만 출력 \n` + todoPrint.showTasksByTag('programming'));
//> [ todo , 총 2 개 ]
//- 13번, 자바스크립트 공부
//- 17번, iOS 공부
//
//[ done , 총 1 개 ]
//- 21번, Closure 공부 1 일 26 분

//console.log(`\n 모든 상태 출력 \n` + todoPrint.showTasksByStatus());

console.log(`\n 특정 상태 'doing'만 출력 \n` + todoPrint.showTasksByStatus('dOing'));

console.log(`\n 특정 상태 'done'만 출력 \n` + todoPrint.showTasksByStatus('dONe'));

/********
[To-do]
    [V] 태그 기반 할일 목록 출력 메서드
    [ ] 상태 기반 할일 목록 출력 메서드
    [ ] Update todo.updateTask method for time tagging when status changed into doing & done.
*********/

/*
다양한 출력을 지원한다. (모든태그, 특정태그, 모든리스트, 특정상태리스트)
doing 에서 done으로 갈때는 소요시간이 출력되도록 doing상태부터 시간정보가 있어야 한다.
showAll메서드는 모든리스트를 출력하며, 2초-> 3초 ->2초로 출력된다. (총7초 소요)
<<<<<<< HEAD
출력을 담당하는 객체를 만든다. todo를 관리하는 객체 이외에 별도의 출력을 위한 객체를 새로 만든다.


> todo.showTag('programming');  // programming 태그와 일치하는  task 출력
[ todo , 총2개 ]
- 13번, 자바스크립트공부
- 17번, iOS공부

[ done , 총1개 ]
- 21번, closure공부 1일 23분


> todo.showTags();  // 태그가 있는 모든 task 출력
[ programming , 총2개 ]
- 13번, 자바스크립트공부, [todo]
- 17번, iOS공부, [doing]

[ play , 총1개 ]
- 18번, 여행가기, [doing]


> todo.show(" Doing ");   //  'todo', 'done'도 역시 같은형태로 결과 출력되어야 함.
- 13번, 자바스크립트공부, [programming]
- 17번, iOS공부, [programming]
- 18번, 여행가기, [play]


> todo.show("done");  //done항목을 노출할때는,  doing-> done까지 소요된 시간이 출력된다.
- 20번, 휴대폰수리, [other], 1시간1분
- 21번, closure공부, [programming], 1일 23분


>  todo.showAll();   //  모든 리스트를 지연출력.  'todo', 'done'도 역시 아래와 같은 형태와 방식으로 출력되어야 함.
"총 7개의 리스트를 가져왔습니다. 2초뒤에 todo내역을 출력합니다....."
[ todo , 총3개 ]
- 13번, 자바스크립트공부, [programming]
- 17번, iOS공부, [programming]
- 18번, 여행가기, [play]

"지금부터 3초뒤에 doing내역을 출력합니다...."
[ doing , 총2개 ]
- 14번, 블로그쓰기, [other]
- 10번, 알고리즘공부

<<<<<<< HEAD
console.log(todo.todoList[0], todo.countOfStatus);
=======
    todoList : {},
    addTask({name, tag}) {
        //add todo on todoList
            // assign id#
            const taskId = todoList.keys().length++;
            
        //log completion message
        this.logUpdateResult('add', taskObj);
=======
        this.logUpdateResult('add', {taskId: taskId, taskName: newTaskName});
>>>>>>> Add task addition method
=======
        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
>>>>>>> Improve namespace of each methods
    },
    updateTask({id, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const {name: targetTaskName, status: currentStatus} = targetTask;
        
        targetTask.status = newStatus;
        this.countOfStatus[currentStatus]--;
        this.countOfStatus[newStatus]++;

        this.printUpdateResult('update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}) {
        const {name, status} = this.todoList[id-1];
        delete this.todoList[id-1];
        this.countOfStatus[status]--;

        this.printUpdateResult('remove', {taskId: id, taskName: name});
    },
    printUpdateResult(actionType, {taskId, taskName, prevStatus, nextStatus}) {
        const countOfTasksPerStatus = `현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;

        if (actionType === 'add') {
            console.log(`id: ${taskId} "${taskName}" 항목이 새로 추가됐습니다.\n${countOfTasksPerStatus}`);    
            return
        } 
        if (actionType === 'update') {
            console.log(`id: ${taskId} "${taskName}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.\n${countOfTasksPerStatus}`);
            return
        } 
        if (actionType === 'remove') {
            console.log(`id: ${taskId}, "${taskName}" 항목 삭제 완료`);
            return
        }
    }
};

//Test cases
/*
todo.addTask({name: "자바스크립트 공부하기", tag:"programming"});
//> id: 1 "자바스크립트 공부하기" 항목이 새로 추가됐습니다.
//> 현재상태 : todo: 1개, doing: 0개, done: 0개

todo.updateTask({id:1,  nextStatus:"doNe"});
//> id: 1 "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
//> 현재상태 : todo: 0개, doing: 0개, done: 1개

todo.removeTask({id:1});
//> id: 1, "자바스크립트 공부하기" 항목 삭제 완료

console.log(todo.todoList[0], todo.countOfStatus);

<<<<<<< HEAD
/*
[요구사항]
새로운 task를 추가할 수 있음
태그(tag)를 옵션으로 추가할 수 있음
모든 task는 id를 가짐
todo/doing/done 상태를 가짐(add시에는 todo)
상태변경을 할 수 있음
code 구현형태

코드의 형태는 객체리터럴 형태로 구현한다.

[동작형태]

> todo.add({name: "자바스크립트 공부하기", tag:"programming"});  // 태그를 입력받는다.
id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다. 
현재상태 :  todo:1개, doing:2개, done:2개

> todo.update({id:4,  nextstatus:"doNe"});  //대소문자 모두 잘 된다.
id: 4,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.
현재상태 :  todo:1개, doing:1개, done:4개  

> todo.remove({id:3});
id:3, iOS공부하기 삭제완료. '
>>>>>>> Add initial application template
=======
"지금부터 2초뒤에 done내역을 출력합니다....."
[ done , 총2개 ]
- 20번, 휴대폰수리, [other], 1시간1분
- 21번, closure공부, [programming], 1일 23분
>>>>>>> Add todoPrint.showTasksByTag method for printing all tasks after grouping them with same tags

=======
>>>>>>> Improve namespace of each methods
=======
>>>>>>> Add todoPrint.showTasksByStatus method for printing tasks in specific status
*/