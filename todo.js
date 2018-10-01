'use strict'

const todo = {
    todoList : [],
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}) {
        // check if there are task with requested name already
        const isAnyErrors = todoErrorCheck.onTaskAddition(this.todoList, newTaskName);
        if(isAnyErrors) return false
        
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.countOfStatus.todo++;

        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const isAnyErrors = todoErrorCheck.onTaskUpdate(this.todoList, id, targetTask, newStatus);
        if(isAnyErrors) return false

        const {name: targetTaskName, status: currentStatus} = targetTask;
        
        if (nextStatus === 'doing') targetTask.startTime = Date.now();
        if (nextStatus === 'done') targetTask.endTime = Date.now();

        targetTask.status = newStatus;
        this.countOfStatus[currentStatus]--;
        this.countOfStatus[newStatus]++;

        this.printUpdateResult('update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}) {
        const isAnyErrors = todoErrorCheck.onTaskRemove(this.todoList, id);
        if(isAnyErrors) return false

        const {name, status} = this.todoList[id-1];
        delete this.todoList[id-1];
        this.countOfStatus[status]--;

        this.printUpdateResult('remove', {taskId: id, taskName: name});
    },
    printUpdateResult(actionType, {taskId, taskName, prevStatus, nextStatus}) {
        const countOfTasksPerStatus = `현재상태 : todo: ${this.countOfStatus.todo}개, doing: ${this.countOfStatus.doing}개, done: ${this.countOfStatus.done}개`;
        const printAction = {
            add() {
                console.log(`id: ${taskId} "${taskName}" 항목이 새로 추가됐습니다.\n${countOfTasksPerStatus}`);
            },
            update() {
                console.log(`id: ${taskId} "${taskName}" 항목이 ${prevStatus} => ${nextStatus} 상태로 업데이트 됐습니다.\n${countOfTasksPerStatus}`);
            },
            remove() {
                console.log(`id: ${taskId}, "${taskName}" 항목 삭제 완료`);
            }
        };
        
        printAction[actionType]();
    },
    undo() {

    },
    redo() {
        
    }
};

const todoPrint = {
    showTasksByTag(tag) {
        const targetTag = tag.toLowerCase();
        
        // Group tasks by status
        const resultObj = todo.todoList
                            .filter(({tag}) => tag === targetTag)
                            .reduce(
                                (resultObj, task) => {
                                    resultObj[task.status] = [task].concat( (!resultObj[task.status]) ? [] : resultObj[task.status] );
                                    return resultObj
                                }, 
                                {}
                            );
        
        // Convert resultObj into printable String
        const resultStr = Object.keys(resultObj).reduce((statusInStr, status) => {
                statusInStr += `${(statusInStr) ? `\n\n` : ''}[ ${status} , 총 ${resultObj[status].length} 개 ]`;
                statusInStr += resultObj[status].reduce( (tasksInStr, task) => {
                        tasksInStr += `\n- ${task.id}번, ${task.name}`;
                        tasksInStr += ( (task.status === 'done') ? ` ${this.applyPrintableTimeFormat(task.endTime - task.startTime)}` : `` );
                        return tasksInStr
                    },
                    ``
                );
                return statusInStr
            },
            ``
        );

        console.log(resultStr);
    },
    showAllTasksWithTag() {
        let resultStr = '';
        const resultObj = {};
            
        //Group tasks by tags
        todo.todoList.forEach((task) => {
            if (!task.tag) return
            if (!resultObj[task.tag]) {
                resultObj[task.tag] = [];
            }
            resultObj[task.tag].push(task);
        });
        
        // Add task info into resultStr for tasks in object created above
        Object.keys(resultObj).forEach((tag) => {
            resultStr += `${(resultStr) ? `\n\n` : ''}[ ${tag} , 총 ${resultObj[tag].length} 개 ]`;
            resultObj[tag].forEach((task) => {
                resultStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`
            });
        });
        console.log(resultStr);
        return
    },
    showTasksByStatus(status) {
        let resultStr = '';
        const resultObj = {};
        const targetStatus = status.toLowerCase();

        // Group tasks by status
        todo.todoList.forEach((task) => {
            if (task.status !== targetStatus) return
            if (!resultObj[task.status]) {
                resultObj[task.status] = [];
            }
            resultObj[task.status].push(task);
        });
        // abort method if there are no tasks under requested status
        if(!resultObj[targetStatus]) {
            console.log(`${targetStatus} 상태로 등록된 할일이 없습니다`);
            return false
        }

         // Add task info into resultStr for tasks in object created above
         resultObj[targetStatus].forEach((task) => {
            resultStr += `${(resultStr) ? `\n` : ''}- ${task.id}번, ${task.name}, [${task.tag}]`
            if(targetStatus === 'done') {
                resultStr += `, ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); 
            } 
        });

        console.log(resultStr);
        return
    },
    showAllTasksByStatus(sequenceArr) {
        const resultObj = {};

        todo.todoList.forEach((task) => {
            if (!resultObj[task.status]) {
                resultObj[task.status] = [];
            }
            resultObj[task.status].push(task);
        });
    
        //Print initial message 
        console.log(`총 ${todo.todoList.length} 개의 리스트를 가져왔습니다. ${parseInt(sequenceArr[0].timeout/1000)} 초 뒤에 ${sequenceArr[0].status} 내역을 출력합니다.....`);

        this.printTasksAsync(resultObj, sequenceArr);
    },
    printTasksAsync(groupedTaskObj, sequenceArr, sequenceIdx = 0) {
        const sequenceLen = sequenceArr.length;
        const hasPrintFinished = !(sequenceLen-sequenceIdx);
        const isOnLastSequence = (sequenceLen-sequenceIdx) === 1;
        
        if(hasPrintFinished) return
        
        const currentStatus = sequenceArr[sequenceIdx].status;
        const currentTimeout = sequenceArr[sequenceIdx].timeout;
        const nextStatus = (isOnLastSequence) ? null : sequenceArr[sequenceIdx+1].status;
        const nextTimeout = (isOnLastSequence) ? null : sequenceArr[sequenceIdx+1].timeout;
        
        setTimeout(() => {
            cb([currentStatus, nextStatus, nextTimeout]);
            this.printTasksAsync(groupedTaskObj, sequenceArr, sequenceIdx+1);
            },  
            currentTimeout
        );
        
        function cb ([status, nextStatus, delay]) {
            // abort method if there are no tasks under requested status
            if(!groupedTaskObj[status]) {
                console.log(`${status} 상태로 등록된 할일이 없습니다`);
            } else {
                console.log(`[ ${status}, 총 ${groupedTaskObj[status].length} 개 ]`);
                todoPrint.showTasksByStatus(status);
            }
            if(nextStatus) console.log(`\n지금부터 ${parseInt(delay/1000)} 초 뒤에 ${nextStatus} 할일 목록을 출력합니다...`);
            return true;
        }
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

const todoErrorCheck = {
    onTaskAddition(targetTodoList, newTaskName) {
        const isTaskNameTaken = this.checkTaskNameDuplication(targetTodoList, newTaskName);
        if(isTaskNameTaken) {
            console.log(`[error] 할 일 목록 todo에 이미 같은 이름의 할 일이 존재합니다.`);
            return true
        }
        return false
    },
    onTaskUpdate(targetTodoList, id, targetTask, newStatus) {
        //Alert user if requested with not existing task ID
        const isTaskNotExists = this.checkIfIdNotExists(targetTodoList, id);
        if(isTaskNotExists) {
            console.log(`[error] ${id} 번 항목이 존재하지 않아 수정하지 못했습니다.`);
            return true
        }

        // Alert if user tried to update status same with current status
        const isStatusNotNew = targetTask.status === newStatus
        if(isStatusNotNew) {
            console.log(`[error] ${id} 번 항목은 이미 ${targetTask.status} 상태입니다.`);
            return true
        }
        
        // prohibit task update from done to doing or todo
        const isUpdatingTaskDone = targetTask.status === 'done'
        if(isUpdatingTaskDone) {
            console.log(`[error] ${id} 번 항목은 done 상태입니다. ${newStatus} 상태로 바꿀 수 없습니다.`);
            return true
        }
        

        return false
    },
    onTaskRemove(targetTodoList, id) {
        // Alert if user tried to remove not existing id
        const isTaskNotExists = this.checkIfIdNotExists(targetTodoList, id);
        if(isTaskNotExists) {
            console.log(`[error] ${id} 번 항목이 존재하지 않아 삭제하지 못했습니다.`);
            return true
        }

        return false
    },
    checkTaskNameDuplication(targetTodoList, newTaskName) {
        const tasksInTodoStatus = ({status}) => status === 'todo';
        const hasTheNameAlready = ({name}) => name === newTaskName;
        
        return targetTodoList.filter(tasksInTodoStatus).some(hasTheNameAlready)
    },
    checkIfIdNotExists(targetTodoList, taskId) {
        const isTaskExists = targetTodoList.some( ({id}) => id === taskId );

        return (isTaskExists) ? false : true
    }
};

const todoUndo = {
    history: [], // [ {actionType: add, argument: {name: "자바스크립트 공부하기", tag:"programming"} } ]
    undoHistory: [],
    addToHistory(actionType, argument, result) {
        
    },
    addToUndoHistory() {

    }
    //on todo object call, log action data on history Arr. 
        // if history.length =3, shift 1 & push new one
    //on todo.undo call, do proper action to negate previous action (i.e. do remove to undo add call)
        //and move argument object from history to undo History
    //on todo.redo call, execute function using undoHistory arr
    // If user do something while something still there in undoHistory, clear them all
};

// ========== [To do] =============
// Improve todo methods considering future undo
// [ ] Create todoUndo object
//      // undo(add) => todoList.length--; & countofstatus['todo']--;
//      // undo(update) => targetTask.status = prevStatus & countOfStatus[newStatus]--; & countOfStatus[prevStatus]++;
//      // undo(remove) => this.todoList[id-1] = ${removedTask}
// [ ] update methods under todo object to liase with todoUndo
// =================================

//Test Cases
todo.todoList.push(
    {id: 1, name: '자바스크립트 공부', status: 'todo', tag: 'programming'},
    {id: 2, name: 'iOS 공부', status: 'todo', tag: 'programming'},
    {id: 3, name: 'Closure 공부', status: 'done', startTime: 1537838429530, endTime: 1537926397371, tag: 'programming'},
    {id: 4, name: '여행가기', status: 'doing', startTime: '04:19', tag: 'play'}
);


todo.addTask({name: '자바스크립트 공부', tag: 'Hobby'});
//[error] todo 목록에 이미 같은 이름의 할 일이 존재합니다.

todo.updateTask({id: 2, nextStatus:'todo'});
//[error] 2 번 항목은 이미 todo 상태입니다.

todo.updateTask({id: 3, nextStatus:'doing'});
//[error] 3 번 항목은 done 상태입니다. doing 상태로 바꿀 수 없습니다.

todo.updateTask({id: 23, nextStatus: 'doing'});
//[error] 23 번 항목이 존재하지 않아 수정하지 못했습니다.

todo.removeTask({id: 23});
//[error] 23 번 항목이 존재하지 않아 삭제하지 못했습니다.

// ==== undo & redo Test cases

// Add 
todo.add({name: "알고리즘 스터디", tag:"Study"});

todo.undo();

todo.redo();

// Update
todo.update({id:1,  nextstatus:"doNe"});
//id: 1,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.

todo.undo();

todo.redo();

// Remove
todo.remove({id:3});

todo.undo();

todo.redo();