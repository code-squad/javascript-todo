'use strict'

const todo = {
    todoList : [],
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}) {
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.countOfStatus.todo++;

        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const {name: targetTaskName, status: currentStatus} = targetTask;
        
        if (nextStatus === 'doing') targetTask.startTime = Date.now();
        if (nextStatus === 'done') targetTask.endTime = Date.now();

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
            
        const targetTag = tag.toLowerCase();
        // Group tasks by status
        for (let task of todo.todoList) {
            if (task.tag !== targetTag) continue;
            if (!resultObj[task.status]) {
                resultObj[task.status] = [];
            }
            resultObj[task.status].push(task);
        }
        // Add task info into resultStr for tasks in object created above
        for (let status of Object.keys(resultObj)) {
            resultStr += `${(resultStr) ? `\n\n` : ''}[ ${status} , 총 ${resultObj[status].length} 개 ]`;
            for (let task of resultObj[status]) {
                resultStr += `\n- ${task.id}번, ${task.name}`
                if(status === 'done') {
                    resultStr += ` ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); 
                }
            }
        }

        console.log(resultStr);
        return
    },
    showAllTasksWithTag() {
        let resultStr = '';
        const resultObj = {};
            
        //Group tasks by tags
        for (let task of todo.todoList) {
            if (!task.tag) continue; 
            if (!resultObj[task.tag]) {
                resultObj[task.tag] = [];
            }
            resultObj[task.tag].push(task);
        }
        // Add task info into resultStr for tasks in object created above
        for (let tagName of Object.keys(resultObj)) {
            resultStr += `${(resultStr) ? `\n\n` : ''}[ ${tagName} , 총 ${resultObj[tagName].length} 개 ]`;
            for (let task of resultObj[tagName]) {
                resultStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`
            }
        }
        console.log(resultStr);
        return
    },
    showTasksByStatus(status) {
        let resultStr = '';
        const resultObj = {};
        const targetStatus = status.toLowerCase();

        // Group tasks by status
        for (let task of todo.todoList) {
            if (task.status !== targetStatus) continue;
            if (!resultObj[task.status]) {
                resultObj[task.status] = [];
            }
            resultObj[task.status].push(task);
        }
        // abort method if there are no tasks under requested status
        if(!resultObj[targetStatus]) {
            console.log(`${targetStatus} 상태로 등록된 할일이 없습니다`);
            return false
        }

         // Add task info into resultStr for tasks in object created above
         for (let task of resultObj[targetStatus]) {
            resultStr += `${(resultStr) ? `\n` : ''}- ${task.id}번, ${task.name}, [${task.tag}]`
            if(targetStatus === 'done') {
                resultStr += `, ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); 
            } 
        }

        console.log(resultStr);
        return
    },

    showAllTasksByStatus() {
        let resultStr = '';
        const resultObj = {};

        for (let task of todo.todoList) {
            if (!resultObj[task.status]) {
                resultObj[task.status] = [];
            }
            resultObj[task.status].push(task);
        }
        //Print initial message 
        console.log(`총 ${todo.todoList.length} 개의 리스트를 가져왔습니다. 2 초 뒤에 todo 내역을 출력합니다.....`);
        
        const cb = ([status, nextStatus, delay]) => {
            // abort method if there are no tasks under requested status
            if(!resultObj[status]) {
                console.log(`${status} 상태로 등록된 할일이 없습니다`);
            } else {
                console.log(`[ ${status}, 총 ${resultObj[status].length} 개 ]`);
                this.showTasksByStatus.bind(this)(status);
            }
            if(nextStatus) console.log(`\n지금부터 ${parseInt(delay/1000)} 초 뒤에 ${nextStatus} 할일 목록을 출력합니다...`);
            return true;
        }
        
        setTimeout((status, nextStatus, delay) => {
                cb(status, nextStatus, delay);
                setTimeout((status, nextStatus, delay) => {
                        cb(status, nextStatus, delay);
                        setTimeout((status, nextStatus, delay) => {
                                cb(status, nextStatus, delay);
                            },
                            2000,
                            ['done']
                        );
                    },
                    3000,
                    ['doing', 'done', 2000]
                );
            },
            2000,
            ['todo', 'doing', 3000]
        );

        console.log(resultStr);
        return
    },
    applyPrintableTimeFormat(timeInMs) {
        let timeSpentStr = '';

        const daysSpent = parseInt(timeInMs/1000/60/60/24);
        const hoursSpent = parseInt(timeInMs/1000/60/60) - (daysSpent * 24);
        const minutesSpent = parseInt(timeInMs/1000/60) - (daysSpent * 24 * 60) - (hoursSpent * 60);
        
        if (daysSpent) timeSpentStr += `${daysSpent} 일`;
        if (hoursSpent) {
            timeSpentStr += (timeSpentStr) ? ` ${hoursSpent} 시간`: `${hoursSpent} 시간`;
        }
        if (minutesSpent) {
            timeSpentStr += (timeSpentStr) ? ` ${minutesSpent} 분`: `${minutesSpent} 분`;
        }

        return timeSpentStr
    }
};

/*
//Test case for user journey
todo.addTask({name: '자바스크립트 공부', tag: 'programming'});
todo.updateTask({id: 1, nextStatus: 'doing'});
todo.updateTask({id: 1, nextStatus: 'done'});
todo.todoList[0].endTime = 1538147881901;
todoPrint.showTasksByStatus();



// Test cases for individual methods
todo.todoList.push(
    {id: 13, name: '자바스크립트 공부', status: 'todo', tag: 'programming'},
    {id: 17, name: 'iOS 공부', status: 'todo', tag: 'programming'},
    {id: 21, name: 'Closure 공부', status: 'done', startTime: 1537838429530, endTime: 1537926397371, tag: 'programming'},
    {id: 18, name: '여행가기', status: 'doing', startTime: '04:19', tag: 'play'}
);

console.log(`\n === 모든 태그 출력 === \n`);
todoPrint.showAllTasksWithTag();
// [ programming , 총 3 개 ]
//- 13번, 자바스크립트 공부, [todo]
//- 17번, iOS 공부, [todo]
//- 21번, Closure 공부, [done]
//
//[ play , 총 1 개 ]
//- 18번, 여행가기, [doing]

console.log(`\n === 특정 태그만 출력 === \n`);
todoPrint.showTasksByTag('programming');
// [ todo , 총 2 개 ]
//- 13번, 자바스크립트 공부
//- 17번, iOS 공부
//
//[ done , 총 1 개 ]
//- 21번, Closure 공부 1 일 26 분

console.log(`\n === 특정 상태 'doing'만 출력 === \n`);
todoPrint.showTasksByStatus('dOing');
//- 18번, 여행가기, [play]


console.log(`\n === 특정 상태 'done'만 출력 === \n`);
todoPrint.showTasksByStatus('dONe');
//- 21번, Closure 공부, [programming], 1 일 26 분

console.log(`\n === 모든 상태 출력 === \n`);
todoPrint.showAllTasksByStatus();
//총 4 개의 리스트를 가져왔습니다. 2 초 뒤에 todo 내역을 출력합니다.....
//[ todo, 총 2 개 ]
//- 13번, 자바스크립트 공부, [programming]
//- 17번, iOS 공부, [programming]
//
//지금부터 3 초 뒤에 doing 할일 목록을 출력합니다...
//[ doing, 총 1 개 ]
//- 18번, 여행가기, [play]
//
//지금부터 2 초 뒤에 done 할일 목록을 출력합니다...
//[ done, 총 1 개 ]
//- 21번, Closure 공부, [programming], 1 일 26 분

*/