'use strict'

const todo = {
    todoList : [],
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}, bRedo = false) {
        // check if there are task with requested name already
        const bNoErrors = todoErrorCheck.onTaskAddition(this.todoList, newTaskName);
        if(!bNoErrors) return false
        
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.countOfStatus.todo++;

        todoUndoRedo.updateActionHistory('add', [...arguments], [this.todoList, this.countOfStatus]);
        if(!bRedo) todoUndoRedo.clearUndoHistory();

        this.printUpdateResult('add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}, bRedo = false) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const bNoErrors = todoErrorCheck.onTaskUpdate(this.todoList, id, targetTask, newStatus);
        if(!bNoErrors) return false

        if (newStatus === 'doing') targetTask.startTime = Date.now();
        if (newStatus === 'done') targetTask.endTime = Date.now();

        const {name: targetTaskName, status: currentStatus} = targetTask;

        targetTask.status = newStatus;
        this.countOfStatus[currentStatus]--;
        this.countOfStatus[newStatus]++;

        todoUndoRedo.updateActionHistory('update', [...arguments], [this.todoList[id-1], currentStatus, this.countOfStatus]);
        if(!bRedo) todoUndoRedo.clearUndoHistory();

        this.printUpdateResult('update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}, bRedo = false) {
        const targetTask = Object.assign({}, this.todoList[id-1] || {});

        const bNoErrors = todoErrorCheck.onTaskRemove(this.todoList, id);
        if(!bNoErrors) return false

        delete this.todoList[id-1];
        this.countOfStatus[targetTask.status]--;

        todoUndoRedo.updateActionHistory('remove', [...arguments], [targetTask, this.todoList]);
        if(!bRedo) todoUndoRedo.clearUndoHistory();

        this.printUpdateResult('remove', {taskId: id, taskName: targetTask.name});
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
        if(!todoUndoRedo.history[0]) {
            console.log(`undo는 최대 3번까지만 할 수 있습니다!`);
            return false
        } 
        const lastAction = todoUndoRedo.history.pop();
        todoUndoRedo.undo[lastAction.type](...lastAction.data);

        todoUndoRedo.updateUndoHistory(lastAction);
    },
    redo() {
        if(!todoUndoRedo.undoHistory[0]) {
            console.log(`모든 undo를 취소했습니다.`);
            return false
        }
        const lastUndo = todoUndoRedo.undoHistory.pop();
        todoUndoRedo.redo[lastUndo.type](...lastUndo.args, true);
    }
};

const todoPrint = {
    showTasksByTag(tag) {
        const targetTag = tag.toLowerCase();
        
        // Group tasks by status
        const resultObj = todo.todoList
                            .filter(({tag}) => tag === targetTag)
                            .reduce((resultObj, task) => {
                                resultObj[task.status] = [task].concat( (!resultObj[task.status]) ? [] : resultObj[task.status] );
                                return resultObj
                            },{});
        
        // Convert resultObj into printable String
        const resultStr = Object.keys(resultObj).reduce( (statusInStr, status) => {
            statusInStr += `${(statusInStr) ? `\n\n` : ''}[ ${status} , 총 ${resultObj[status].length} 개 ]`;
            statusInStr += resultObj[status].reduce( (tasksInStr, task) => {
                tasksInStr += `\n- ${task.id}번, ${task.name}`;
                tasksInStr += ( (task.status === 'done') ? ` ${this.applyPrintableTimeFormat(task.endTime - task.startTime)}` : `` );
                return tasksInStr
            },``);
            return statusInStr
        },``);

        console.log(resultStr);
    },
    showAllTasksWithTag() {
        let resultStr = '';
            
        //Group tasks by tags
        const resultObj = todo.todoList
                            .filter(({tag}) => !!tag)
                            .reduce( (resultObj, task) => {
                                resultObj[task.tag] = [task].concat( (!resultObj[task.tag]) ? [] : resultObj[task.tag] );
                                return resultObj
                            }, {});
        
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
        const targetStatus = status.toLowerCase();

        // Group tasks by status
        const resultObj = todo.todoList
                            .filter(({status}) => status === targetStatus)
                            .reduce( (resultObj, task) => {
                                resultObj[task.status] = [task].concat( (!resultObj[task.status]) ? [] : resultObj[task.status] );
                                return resultObj
                            }, {});
        
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
        // Group tasks by status
        const resultObj = todo.todoList.reduce( (resultObj, task) => {
                                    resultObj[task.status] = [task].concat( (!resultObj[task.status]) ? [] : resultObj[task.status] );
                                    return resultObj
                                }, {});
    
        //Print initial message 
        console.log(`총 ${todo.todoList.length} 개의 리스트를 가져왔습니다. ${parseInt(sequenceArr[0].timeout/1000)} 초 뒤에 ${sequenceArr[0].status} 내역을 출력합니다.....`);

        //Print tasks in each status async
        this.printTasksAsync(resultObj, sequenceArr);
    },
    printTasksAsync(groupedTaskObj, sequenceArr, sequenceIdx = 0) {
        const sequenceLen = sequenceArr.length;
        const hasPrintFinished = !(sequenceLen-sequenceIdx);
        const bOnLastSequence = (sequenceLen-sequenceIdx) === 1;
        
        if(hasPrintFinished) return
        
        const currentStatus = sequenceArr[sequenceIdx].status;
        const currentTimeout = sequenceArr[sequenceIdx].timeout;
        const nextStatus = (bOnLastSequence) ? null : sequenceArr[sequenceIdx+1].status;
        const nextTimeout = (bOnLastSequence) ? null : sequenceArr[sequenceIdx+1].timeout;
        
        setTimeout( (() => {
            cb.call(this,[currentStatus, nextStatus, nextTimeout]);
            this.printTasksAsync(groupedTaskObj, sequenceArr, sequenceIdx+1);
            }).bind(this),  
            currentTimeout
        );
        
        function cb ([status, nextStatus, delay]) {
            // abort method if there are no tasks under requested status
            if(!groupedTaskObj[status]) {
                console.log(`${status} 상태로 등록된 할일이 없습니다`);
            } else {
                console.log(`[ ${status}, 총 ${groupedTaskObj[status].length} 개 ]`);
                this.showTasksByStatus(status);
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
        if (!timeSpentStr) return `doing 상태 없이 완료된 할일`

        return timeSpentStr
    }
};

const todoErrorCheck = {
    onTaskAddition(targetTodoList, newTaskName) {
        const bTaskNameTaken = this.checkTaskNameDuplication(targetTodoList, newTaskName);
        if(bTaskNameTaken) {
            console.log(`[error] 할 일 목록 todo에 이미 같은 이름의 할 일이 존재합니다.`);
            return false
        }
        return true
    },
    onTaskUpdate(targetTodoList, id, targetTask, newStatus) {
        //Alert user if requested with not existing task ID
        const bTaskExists = this.checkIfIdExists(targetTodoList, id);
        if(!bTaskExists) {
            console.log(`[error] ${id} 번 항목이 존재하지 않아 수정하지 못했습니다.`);
            return false
        }

        // Alert if user tried to update status same with current status
        const bStatusNew = targetTask.status !== newStatus
        if(!bStatusNew) {
            console.log(`[error] ${id} 번 항목은 이미 ${targetTask.status} 상태입니다.`);
            return false
        }
        
        // prohibit task update from done to doing or todo
        const bTaskEditable = targetTask.status !== 'done'
        if(!bTaskEditable) {
            console.log(`[error] ${id} 번 항목은 done 상태입니다. ${newStatus} 상태로 바꿀 수 없습니다.`);
            return false
        }
        
        return true
    },
    onTaskRemove(targetTodoList, id) {
        // Alert if user tried to remove not existing id
        const bTaskNotExists = this.checkIfIdExists(targetTodoList, id);
        if(!bTaskNotExists) {
            console.log(`[error] ${id} 번 항목이 존재하지 않아 삭제하지 못했습니다.`);
            return false
        }

        return true
    },
    checkTaskNameDuplication(targetTodoList, newTaskName) {
        const tasksInTodoStatus = ({status}) => status === 'todo';
        const hasTheNameAlready = ({name}) => name === newTaskName;
        
        return targetTodoList.filter(tasksInTodoStatus).some(hasTheNameAlready)
    },
    checkIfIdExists(targetTodoList, taskId) {
        const bTaskExists = targetTodoList.some( ({id}) => id === taskId );

        return (bTaskExists) ? true : false
    }
};

const todoUndoRedo = {
    history: [],
    undoHistory: [],
    undo: {
        add(todoList, todoCountObj) {
            const targetTask = todoList.pop();
            todoCountObj[targetTask.status]--;

            console.log(`${targetTask.id}번, ${targetTask.name} 할일이 삭제됐습니다.`);
        },
        update(targetTask, prevStatus, todoCountObj) {
            const currentStatus = targetTask.status;
            targetTask.status = prevStatus
            todoCountObj[currentStatus]--;
            todoCountObj[prevStatus]++;
            
            //Remove start/endTime if they were added during the update
            if(currentStatus === 'doing') {delete targetTask.startTime}
            if(currentStatus === 'done') {delete targetTask.endTime}

            console.log(`${targetTask.id}번, ${targetTask.name} 할일이 ${currentStatus} => ${prevStatus} 상태로 돌아갔습니다.`);
        },
        remove(targetTask, todoList) {
            todoList[targetTask.id-1] = targetTask;

            console.log(`${targetTask.id}번, ${targetTask.name} 할일이 삭제 => ${targetTask.status} 상태로 돌아갔습니다.`);
        }
    },
    redo: {
        add(...args) {
            todo.addTask(...args);
        },
        update(...args) {
            todo.updateTask(...args);
        },
        remove(...args) {
            todo.removeTask(...args);
        }
    },
    updateActionHistory(actionType, args, actionData) {
        if(this.history.length >= 3) this.history.shift();
        this.history.push({type: actionType, args: args, data:actionData});
    },
    updateUndoHistory(actionObj) {
        this.undoHistory.push(actionObj);
    },
    clearUndoHistory() {
        this.undoHistory.length = 0;
    }
};


//Test Cases
todo.addTask({name: '자바스크립트 공부', tag: 'programming'});
todo.addTask({name: 'iOS 공부', tag: 'programming'});
todo.addTask({name: 'Closure 공부', tag: 'programming'});
todo.addTask({name: '여행가기', tag: 'play'});
todo.updateTask({id: 4, nextStatus: 'doing'});
todo.updateTask({id: 3, nextStatus: 'doing'});
todo.updateTask({id: 3, nextStatus: 'done'});
todo.todoList[2].startTime = 1537838429530;
todo.todoList[2].endTime = 1537926397371;
// 이상의 코드로 아래 상태가 됨 : todo.todoList = (
//     {id: 1, name: '자바스크립트 공부', status: 'todo', tag: 'programming'},
//     {id: 2, name: 'iOS 공부', status: 'todo', tag: 'programming'},
//     {id: 3, name: 'Closure 공부', status: 'done', startTime: 1537838429530, endTime: 1537926397371, tag: 'programming'},
//     {id: 4, name: '여행가기', status: 'doing', startTime: 1537838429530, tag: 'play'}
// );

console.log(`\n====입력 오류 검증 살펴보기====\n`);
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
console.log(`\n====되돌리기 / 다시 실행하기 살펴보기====\n`);
todo.addTask({name: "알고리즘 스터디", tag:"Study"});
//id: 5 "알고리즘 스터디" 항목이 새로 추가됐습니다.

todo.updateTask({id:1,  nextStatus:"doNe"});
//id: 1,  "자바스크립트 공부하기" 항목이 todo => done 상태로 업데이트 됐습니다.

todo.removeTask({id:3});
//id: 3, "Closure 공부" 항목 삭제 완료

console.log(`\n==== undo * 3 ====\n`);
todo.undo();
//3번, Closure 공부 할일이 삭제 => done 상태로 돌아갔습니다.

todo.undo();
//1번, 자바스크립트 공부 할일이 done => todo 상태로 돌아갔습니다.

todo.undo();
//5번, 알고리즘 스터디 할일이 삭제됐습니다.

console.log(`\n==== redo * 2 >> 새 데이터 추가 >> redo * 1 (에러) ====\n`);
todo.redo();
//id: 5 "알고리즘 스터디" 항목이 새로 추가됐습니다.

todo.redo();
//id: 1 "자바스크립트 공부" 항목이 todo => done 상태로 업데이트 됐습니다.

//Undohistory clear test - do something while one more redo-able task exists
todo.addTask({name: "스타벅스 방문", tag:"Drink"});
//id: 6 "스타벅스 방문" 항목이 새로 추가됐습니다.

todo.redo();
// 모든 undo를 취소했습니다.

