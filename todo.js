'use strict'

const todo = {
    todoList : [],
    countOfStatus: {todo: 0, doing: 0, done: 0},
    addTask({name: newTaskName, tag: newTaskTag = ''}, bRedo = false) {
        // check if there are tasks with requested name already
        const bNoErrors = todoErrorCheck.onTaskAddition(this.todoList, newTaskName);
        if(!bNoErrors) return false
        
        const taskId = this.todoList.length + 1;
        const taskToAdd = {id: taskId, name: newTaskName, status: 'todo', tag: newTaskTag};
        
        this.todoList.push(taskToAdd);
        this.updateStatusCount(['todo', +1]);

        todoUndoRedo.updateActionHistory('add', bRedo, [...arguments], [this.todoList, this.countOfStatus]);

        todoPrint.printUpdateResult.call(this,'add', {taskId: taskId, taskName: newTaskName});
    },
    updateTask({id, nextStatus}, bRedo = false) {
        const newStatus = nextStatus.toLowerCase();
        const targetTask = this.todoList[id-1];
        const bNoErrors = todoErrorCheck.onTaskUpdate(this.todoList, id, targetTask, newStatus);
        if(!bNoErrors) return false

        this.addTimestamp(targetTask, newStatus);
        const {name: targetTaskName, status: currentStatus} = targetTask;

        targetTask.status = newStatus;
        this.updateStatusCount([currentStatus, -1], [newStatus, +1]);

        todoUndoRedo.updateActionHistory('update', bRedo, [...arguments], [this.todoList[id-1], currentStatus, this.countOfStatus]);

        todoPrint.printUpdateResult.call(this,'update', {taskId: id, taskName: targetTaskName, prevStatus: currentStatus, nextStatus: newStatus});
    },
    removeTask({id}, bRedo = false) {
        const targetTask = Object.assign({}, this.todoList[id-1] || {});

        const bNoErrors = todoErrorCheck.onTaskRemove(this.todoList, id);
        if(!bNoErrors) return false

        delete this.todoList[id-1];
        this.updateStatusCount([targetTask.status, -1]);

        todoUndoRedo.updateActionHistory('remove', bRedo, [...arguments], [targetTask, this.todoList]);

        todoPrint.printUpdateResult.call(this,'remove', {taskId: id, taskName: targetTask.name});
    },
    updateStatusCount(...args) { //[targetStatus, increment]
        args.forEach( ([targetStatus, increment]) => {
            this.countOfStatus[targetStatus] += increment;    
        } );
    },
    addTimestamp(targetTask, newStatus) {
        const timestamp = {
            doing : () => targetTask.startTime = Date.now(),
            done : () => targetTask.endTime = Date.now()
        }
        timestamp[newStatus]();
    },
    undo() {
        todoUndoRedo.undo();
    },
    redo() {
        todoUndoRedo.redo();
    },
    showTag(tag) {
        todoPrint.showTasksByTag(tag, this.todoList);
    },
    showTags() {
        todoPrint.showAllTasksWithTag(this.todoList);
    },
    show(status) {
        todoPrint.showTasksByStatus(status, this.todoList);
    },
    showAll() {
        const sequenceArr = [ //Status print order & timeout for each status
            {status: 'todo', timeout: 2000}, 
            {status: 'doing', timeout: 3000}, 
            {status: 'done', timeout: 2000}
        ];

        todoPrint.showAllTasksByStatus(sequenceArr, this.todoList);
    }
};

const todoPrint = {
    showTasksByTag(tag, todoList) {
        const targetTag = tag.toLowerCase();
        
        // Group tasks by status
        const filter = ({tag}) => tag.toLowerCase() === targetTag;
        const groupedTasksObj = this.groupTasks(todoList, filter, 'status');

        // Flatten grouped object into formatted Array
        const formattedArr = [];
        Object.keys(groupedTasksObj).forEach( (status) => {
            formattedArr.push(status, groupedTasksObj[status].length, ...groupedTasksObj[status]);
        });
        
        // process above Array into formatted string
        const resultStr = formattedArr.reduce( (workingStr, arrItem) => {
            const process = {
                string() {
                    workingStr += `${(workingStr) ? `\n\n` : ''}[ ${arrItem}`;
                },
                number() {
                    workingStr += ` , 총 ${arrItem} 개 ]`;
                },
                object() {
                    workingStr += `\n- ${arrItem.id}번, ${arrItem.name}`;
                    workingStr += ( (arrItem.status === 'done') ? ` ${this.applyPrintableTimeFormat(arrItem.endTime - arrItem.startTime)}` : `` );
                }
            };
            
            process[typeof arrItem].bind(this)();
            
            return workingStr
        }, ``);

        console.log(resultStr);
    },
    showAllTasksWithTag(todoList) {
        let resultStr = '';
            
        //Group tasks by tags
        const filter = ({tag}) => !!tag;
        const groupedTasksObj = this.groupTasks(todoList, filter, 'tag');
        
        // Add task info into resultStr for tasks in object created above
        Object.keys(groupedTasksObj).forEach((tag) => {
            resultStr += `${(resultStr) ? `\n\n` : ''}[ ${tag} , 총 ${groupedTasksObj[tag].length} 개 ]`;
            groupedTasksObj[tag].forEach((task) => {
                resultStr += `\n- ${task.id}번, ${task.name}, [${task.status}]`
            });
        });
        console.log(resultStr);
    },
    showTasksByStatus(status, todoList) {
        let resultStr = '';
        const targetStatus = status.toLowerCase();

        // Group tasks by status
        const filter = ({status}) => status.toLowerCase() === targetStatus;
        const groupedTasksObj = this.groupTasks(todoList, filter, 'status');
        
        // abort method if there are no tasks under requested status
        if(!groupedTasksObj[targetStatus]) {
            console.log(`${targetStatus} 상태로 등록된 할일이 없습니다`);
            return false
        }

         // Add task info into resultStr for tasks in object created above
         groupedTasksObj[targetStatus].forEach((task) => {
            resultStr += `${(resultStr) ? `\n` : ''}- ${task.id}번, ${task.name}, [${task.tag}]`
            if(targetStatus === 'done') {
                resultStr += `, ` + this.applyPrintableTimeFormat(task.endTime - task.startTime); 
            } 
        });

        console.log(resultStr);
        return
    },
    showAllTasksByStatus(sequenceArr, todoList) {
        // Group tasks by status
        const groupedTasksObj = this.groupTasks(todoList, () => true, 'status');
    
        //Print initial message 
        console.log(`총 ${todoList.length} 개의 리스트를 가져왔습니다. ${parseInt(sequenceArr[0].timeout/1000)} 초 뒤에 ${sequenceArr[0].status} 내역을 출력합니다.....`);

        //Print tasks in each status async
        this.printTasksAsync(groupedTasksObj, sequenceArr, todoList);
    },
    printTasksAsync(groupedTasksObj, sequenceArr, todoList, sequenceIdx = 0) {
        const sequenceLen = sequenceArr.length;
        const hasPrintFinished = !(sequenceLen-sequenceIdx);
        const bOnLastSequence = (sequenceLen-sequenceIdx) === 1;
        
        if(hasPrintFinished) return
        
        const currentStatus = sequenceArr[sequenceIdx].status;
        const currentTimeout = sequenceArr[sequenceIdx].timeout;
        const nextStatus = (bOnLastSequence) ? null : sequenceArr[sequenceIdx+1].status;
        const nextTimeout = (bOnLastSequence) ? null : sequenceArr[sequenceIdx+1].timeout;
        
        setTimeout( (() => {
            cb.call(this,[currentStatus, nextStatus, nextTimeout], todoList);
            this.printTasksAsync(groupedTasksObj, sequenceArr, todoList, sequenceIdx+1);
            }).bind(this),  
            currentTimeout
        );
        
        function cb ([status, nextStatus, delay], todoList) {
            // abort method if there are no tasks under requested status
            if(!groupedTasksObj[status]) {
                console.log(`${status} 상태로 등록된 할일이 없습니다`);
            } else {
                console.log(`[ ${status}, 총 ${groupedTasksObj[status].length} 개 ]`);
                this.showTasksByStatus(status, todoList);
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
    groupTasks(todoList, filterFn, groupingType) {
        return todoList
                    .filter(filterFn)
                    .reduce((resultObj, task) => {
                        resultObj[task[groupingType]] = [task].concat( (!resultObj[task[groupingType]]) ? [] : resultObj[task[groupingType]] );
                        return resultObj
                    },{});
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
    checkIfIdExists(targetTodoList, taskIdToEdit) {
        const bTaskExists = targetTodoList.some( ({id}) => id === taskIdToEdit );

        return bTaskExists
    }
};

const todoUndoRedo = {
    history: [],
    undoHistory: [],
    undoLast: {
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
    redoLast: {
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
    undo() {
        if(!this.history[0]) {
            console.log(`undo는 최대 3번까지만 할 수 있습니다!`);
            return false
        } 

        const lastAction = this.history.pop();
        this.undoLast[lastAction.type](...lastAction.data);

        this.updateUndoHistory(lastAction);
    },
    redo() {
        if(!this.undoHistory[0]) {
            console.log(`모든 undo를 취소했습니다.`);
            return false
        }
        const lastUndo = this.undoHistory.pop();
        this.redoLast[lastUndo.type](...lastUndo.args, true);
    },
    updateActionHistory(actionType, bRedo, args, actionData) {
        if(this.history.length >= 3) this.history.shift();
        this.history.push({type: actionType, args: args, data:actionData});
        if(!bRedo) todoUndoRedo.clearUndoHistory();
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

