const taskClipBoard = {
    // 3단계 까지 실행취소가 가능하기위해 카운트변수 사용
    undoCount: 0,
    //  길이가 3인 클립보드를 생성, seal을 이용해 push,pop등을 불가능하게 해놓는다.
    clipBoard: Object.seal(new Array(3).fill(undefined)),
    //  클립보드에 실행된 함수의 함수와, 인자를 클립보드에 저장하는 함수
    addclip(name, argument, id, pastState = 0, removedTodo = 0) {
        const Savedfunc = Object.create({});
        [Savedfunc.function, Savedfunc.argument, Savedfunc.id] = [name, argument, id];
        Savedfunc.pastState = pastState;
        Savedfunc.removedTodo = removedTodo;
        if (this.clipBoard[0] === undefined) {
            this.clipBoard[0] = Savedfunc;
        } else {
            this.unshiftClip(Savedfunc, 2);
        }
    },
    // clipBoard 배열의 값을 밀어내주는 함수
    unshiftClip(obj, n) {
        if (n === 0) this.clipBoard[0] = obj;
        else {
            this.clipBoard[n] = this.clipBoard[n - 1];
            return this.unshiftClip(obj, n - 1);
        }
    },
    //  클립보드 array의 가장최근실행된 0번째 함수를 재실행
    redo() {
        if (this.undoCount === 0) {
            console.log('원복할 데이터가 존재하지 않습니다.');
        } else {
            let redofunc = this.clipBoard[this.undoCount - 1].function.bind(taskProgram);
            redofunc(this.clipBoard[this.undoCount - 1].argument, 1);
            this.undoCount--;
        }
    },
    // 클립보드의 0번째의 실행함수를 반대의함수를 실행함으로써 undo기능 구현
    undo() {
        if (this.checkUndoCount()) {
            const obj = { ...this.clipBoard[this.undoCount] };
            if (obj.function.name === 'add') {
                taskProgram.remove({ id: obj.id }, 1);
                this.undoCount++;
            } else if (obj.function.name === 'update') {
                let conleobj = this.createRversedArg(obj);
                // 1인 인자값이 존재할시redo/undo수행시 실행함수를clipBoard에 추가하지 않는다.
                taskProgram.update(conleobj, 1);
                this.undoCount++;
            } else if (obj.function.name === 'remove') {
                console.log('[alert] remove를 실행취소할시 state값은 삭제될때의 상태로 추가됩니다.');
                taskProgram.add(obj.removedTodo, 1);
                this.undoCount++;
            }
        };
    },
    // update 실행취소시 이전상태와 현재상태를 바꿔주는 함수
    createRversedArg(Obj) {
        let obj = Object.create({
            id: Obj.id,
            nextstatus: Obj.pastState
        });
        return obj;
    },
    // undo카운트 체크함수 3일시 실행취소불가
    checkUndoCount() {
        if (this.undoCount === 3) {
            console.log('실행취소는 3단계 까지 지원됩니다.현재 최대 실행취소단계입니다.');
            return false;
        } else {
            return true;
        }
    }
};
const taskProgram = {
    taskArray: [],
    taskCount: 0,
    setTimeArray: [2000, 5000, 7000],
    add(obj, redoundo = 0) {
        if (this.checkName(obj)) {
            const newTodo = Object.create({});
            this.checkTag(obj);
            [newTodo.id, newTodo.name, newTodo.tag, newTodo.state] =
                [taskProgram.taskCount, obj.name.toLowerCase(), obj.tag.toLowerCase(), obj.state || 'todo'];
            newTodo.startTime = new Date('6/10/2018 4:20 pm');
            this.increaseTaskCount();
            this.taskArray.push(newTodo);
            if (redoundo === 0) taskClipBoard.addclip(this.add, obj, newTodo.id);
            return [console.log(`id : ${newTodo.id}, "${obj.name}" 항목이 추가 되었습니다.`), this.showState()];
        }
    },
    // 태그값이 없을시 초기값부여 ''을 가진tag가 들어올경우도 있기에 length검사를 한번더한다.
    checkTag(obj) {
        if (obj.tag === undefined) obj.tag = '';
        else {
            if (obj.tag.length !== 0) {
                let removedSpaceTag = obj.tag.match(/\S/g).join('');
                obj.tag = removedSpaceTag;
            }
        }
    },
    // name 값 오류검사
    checkName(obj) {
        if (obj.name.length === 0) {
            console.log('[Error] name값을 입력해주세요');
            return false;
        } else if (typeof (obj.name) === 'string') {
            obj = this.removeSpace(obj);
            for (let taskobj of this.taskArray) {
                if (obj.name === taskobj.name) {
                    console.log('[Error] 이미 같은 스케줄이 있서요');
                    return false;
                }
            }
        } return true;
    },
    // name 값 strig 공백제거 함수
    removeSpace(obj) {
        let removedSpaceName = obj.name.match(/\S/g).join('');
        obj.name = removedSpaceName;
        return obj;
    },
    // task id값 증가함수, 
    increaseTaskCount() {
        this.taskCount++;
    },
    // 상태별 task갯수 출력함수
    showState() {
        const filteredArray = this.filteringStates(this.taskArray);
        let todo, doing, done;
        [todo, doing, done] = [filteredArray[0].length, filteredArray[1].length, filteredArray[2].length];
        return console.log(`현재상태 :  todo : ${todo}, doing : ${doing}, done : ${done} `);
    },
    // status 종류별로 filter메서드
    filteringStates(array) {
        const stateTodo = array.filter(v => v.state === 'todo');
        const stateDoing = array.filter(v => v.state === 'doing');
        const stateDone = array.filter(v => v.state === 'done');
        return [stateTodo, stateDoing, stateDone];
    },
    // 상태별 모든task 출력
    showAll() {
        let todo, doing, done;
        [todo, doing, done] = this.filteringStates(this.taskArray);
        console.log(`총 ${this.taskCount}개의 스케줄이 있습니다. 2초뒤 Todo출력...`)
        this.settime(0, [todo, doing, done], this.setTimeArray);
    },
    // 초기값 n = 0 으로 받아 loopPrint를 시간차로 실행
    settime(n, statesArray, setTimeArray) {
        let states = ['doing', 'done'];
        let time = (setTimeArray[n + 1] - setTimeArray[n]) / 1000;
        if (n > 2) return;
        else {
            setTimeout(() => {
                this.loopPrint(statesArray[n]);
                if (n >= 2) return;
                console.log(`지금부터 ${time}초뒤 ${states[n]}출력....`);
            }, setTimeArray[n]);
            return this.settime(n + 1, statesArray, setTimeArray);
        }
    },
    // task상태 업데이트 함수
    update(obj, undoredo = 0) {
        if (this.checkParametertype(obj)) {
            let transobj = this.checkParametertype(obj);
            if (this.checkId(transobj) && this.checkState(transobj)) {
                let [id, updatedName, pastState, updatedStatus] = this.updatingState(transobj);
                if (undoredo === 0) taskClipBoard.addclip(this.update, transobj, id, pastState);
                console.log(`id : ${id}, "${updatedName}" 항목이 ${pastState} => ${updatedStatus} 상태로 업데이트 됐습니다 `);
                return this.showState();
            }
        }
    },
    // 업데이트시 string 공백제거 함수 argumet가 string 일때만 필요함
    removeSpaceString(arg) {
        let removedSpaceName = arg.replace(/(\s*)/g, '').toLowerCase();
        return removedSpaceName;
    },
    // update시 Parameter 타입 검사함수
    checkParametertype(arg) {
        if (typeof (arg) === 'string') {
            if (this.transObj(arg)) {
                let transedObj = this.transObj(arg);
                return transedObj;
            }
        } else if (typeof (arg) === 'object') {
            return arg;
        } else {
            console.log('올바른 입력값이 필요합니다. "id$state 또는 {id: nexststatus: } " 중하나를 입력하세요.');
            return false;
        }
    },
    //  업데이트시 Parameter 가 string일때 object로 변환해주는 함수
    transObj(obj) {
        let name = this.removeSpaceString(obj);
        let inputValue = name.match(/^\d*\$(todo|doing|done)$/g);
        let transObj = {};
        if (inputValue) {
            [transObj.id, transObj.nextstatus] = [Number(inputValue[0].match(/\d*/).join('')), inputValue[0].match(/[^0-9\$]\w*/).join('')];
        } else {
            console.log('올바른 입력값이 필요합니다. "id$state 또는 {id: nexststatus: } " 중하나를 입력하세요.');
            return false;
        }
        return transObj;
    },
    // state를 사용자가 입력한 nextstatus로 바꿔주는 함수
    updatingState(obj) {
        let updatedStatus, id, updatedName, pastState;
        [updatedStatus, id] = [obj.nextstatus.toLowerCase().match(/\btodo|doing|done/g).join(''), obj.id];
        this.taskArray.forEach(v => {
            if (v.id === id) {
                v.pastState = v.state;
                [updatedName, pastState, v.state] = [v.name, v.state, updatedStatus];
            }
        });
        return [id, updatedName, pastState, updatedStatus];
    },
    // update시 해당 id값의 task가 존재하는지 확인하는 함수
    checkId(obj) {
        if (obj.id > this.taskCount) {
            console.log(`[error] ${obj.id}번 아이디는 존재하지 않아요`)
            return false;
        }
        for (let task of this.taskArray) {
            if (task.id === obj.id) {
                return true;
            }
        }
        console.log(`[error] ${obj.id}번 아이디는 존재하지 않아요`)
        return false;
    },
    // remove기능실행시 오류 검사 함수
    cehckType(obj) {
        if (typeof (obj) !== 'object') {
            console.log('{id : 삭제를원하는 아이디값} 의형식으로 입력해주세요')
            return false;
        }
        return true;
    },
    // update 실행시 state값에따라 시작시간,종료시간 추가함수
    checkState(obj) {
        if (this.checkSyntax(obj)) {
            const changedstate = obj.nextstatus.toLowerCase().match(/\btodo|doing|done/g).join('');
            let sameObj = this.findArray(obj);
            let userWantObj = this.taskArray[this.taskArray.indexOf(...sameObj)];
            if (changedstate === 'todo' | 'doing') {
                const startTime = new Date('6/10/2018 4:20 pm');
                userWantObj.startTime = startTime;
            } else if (changedstate === 'done') {
                // test용 시간 입력 사용시 new Date()로 사용
                const endTime = new Date('6/11/2018 3:20 pm');
                userWantObj.endTime = endTime;
                this.setTurnaroundTime(userWantObj);
            }
            return true;
        } else {
            console.log('[error] 상태값은 todo,doing,done 중 하나만 입력가능합니다');
            return false;
        }
    },
    // 상태값의 공백제거 함수
    removeSpaceState(obj) {
        let removedSpaceState = obj.nextstatus.match(/\S/g).join('');
        obj.nextstatus = removedSpaceState;
        return obj;
    },
    // 문법 검사함수, 원하는상태값 이외의 결과는 오류
    checkSyntax(obj) {
        obj = this.removeSpaceState(obj);
        if (obj.nextstatus.toLowerCase().match(/\btodo|doing|done/g)) return true;
        return false;
    },
    // todo or doing => done 으로 상태변경시 걸린 시간계산 함수
    setTurnaroundTime(userWantObj) {
        let turnaroundTime, endT, startT;
        [endT, startT] = [userWantObj.endTime, userWantObj.startTime];
        turnaroundTime = endT - startT;
        userWantObj.turnaroundTime = turnaroundTime;
        this.getTime(userWantObj);
    },
    // task 상태변경시 추가된 시간을 변환하는 함수 
    getTime(userWantObj) {
        let turnaroundTime = userWantObj.turnaroundTime;
        turnaroundTime /= 1000;
        let seconds = Math.round(turnaroundTime % 60);
        turnaroundTime = Math.floor(turnaroundTime / 60);
        let minutes = Math.round(turnaroundTime % 60);
        turnaroundTime = Math.floor(turnaroundTime / 60);
        let hours = Math.round(turnaroundTime % 24);
        turnaroundTime = Math.floor(turnaroundTime / 24);
        let days = turnaroundTime;
        let totalTime = `${days}일, ${hours}시간, ${minutes}분`;
        let removedZeroTime = this.removeZeroTime(totalTime);
        userWantObj.turnaroundTime = removedZeroTime;
    },
    // `${days}일, ${hours}시간, ${minutes}분` 의 형태로 저장된 시간을 0이 포함된 부분을 제거하는 함수
    removeZeroTime(timeString) {
        let removedZeroTime = timeString.match(/[1-9]{1,3}[가-힣]{1,2}/g).join(' ');
        return removedZeroTime;
    },
    // task 삭제 함수
    remove(obj, redoundo = 0) {
        if (this.cehckType(obj) && this.checkId(obj)) {
            let sameArray = this.findArray(obj);
            const removedtodo = this.taskArray.splice(this.taskArray.indexOf(...sameArray), 1);
            let addArgumnet = removedtodo[0];
            if (redoundo === 0) taskClipBoard.addclip(this.remove, obj, removedtodo[0].id, 0, addArgumnet);
            this.taskCount--;
            console.log(`id : ${removedtodo[0].id}, "${removedtodo[0].name}" 삭제완료.`);
        }
    },
    // 사용자가 삭제를원하는 id값을 받아 같은 task를 찾는함수
    findArray(obj) {
        var sameobj = this.taskArray.filter(v => v.id === obj.id);
        return sameobj;
    },
    // 원하는 tag값 출력 오류수정 추가해야함
    showTag(string) {
        if (this.classifyArgument(string)) {
            const classifiedArray = this.classifyArgument(string);
            const filteredArray = this.filteringStates(classifiedArray);
            let todo, doning, done;
            [todo, doning, done] = filteredArray;
            this.loopPrint(todo);
            this.loopPrint(doning);
            this.loopPrint(done);
        } else console.log('원하시는 태그를 가진 할일이 없습니다');
    },
    // 원하는 tag를 가진 task 분류 함수
    classifyArgument(paramaeter) {
        if (typeof (paramaeter) === 'string') {
            const filteredArray = this.taskArray.filter(v => v.tag === paramaeter.toLowerCase());
            if (filteredArray.length === 0) return false;
            if (filteredArray.length !== 0) return filteredArray;
        } else console.log('tag를 "원하는태그" 의 방식으로 입력해주세요');
    },
    // 입력받은 array를 출력해주는 함수
    loopPrint(arr) {
        if (arr.length === 0) {
            console.log('항목이 없습니다.');
            return;
        }
        arr.name = arr[0].state;
        console.log(`[ ${arr.name}, 총 ${arr.length}개 ]`);
        if (arr.name === 'done') return this.doneArrayPrint(arr);
        arr.forEach(v => {
            if (v.tag.length === 0) { console.log(` - ${v.id}번, ${v.name}`); };
            console.log(` - ${v.id}번, ${v.name}, [${v.tag}]`);
        });
    },
    // tag를 가지는 task가 각tag별 몇개인지 객체로 반환해주는 함수
    numberingOfTags(tagNameArray) {
        const numberOfTags = tagNameArray.reduce((x, y) => {
            x[y] = ++x[y] || 1;
            return x;
        }, {});
        return numberOfTags;
    },
    // tag를 가지고잇는 task filter 함수
    filteringHavigTag() {
        const arrayHavingTag = this.taskArray.filter(v => v.tag.length > 0);
        return arrayHavingTag;
    },
    // tag를 가지는 task 출력함수
    showTags() {
        const tagNameArray = [];
        const arrayHavingTag = this.filteringHavigTag();
        arrayHavingTag.forEach(v => tagNameArray.push(v.tag));
        // 중복된 값을 제거해주는Set ...을쓰면 [{중복없는값들}] 에서 [중복없는값들]로 바뀐다.
        const uniqueTagNameArray = [...new Set(tagNameArray)];
        const numberOfTags = this.numberingOfTags(tagNameArray);
        this.loopTagName(uniqueTagNameArray, numberOfTags, arrayHavingTag);
    },
    // tagname과 그 태그의 갯수 출력함수
    loopTagName(uniqueTagNameArray, numberOfTags, arrayHavingTag) {
        for (let i = 0; i < uniqueTagNameArray.length; i++) {
            const [tagName, numbertag] = [Object.keys(numberOfTags)[i], numberOfTags[Object.keys(numberOfTags)[i]]];
            console.log(`[${tagName}, 총 ${numbertag}개]`);
            this.loopHavingTagArray(arrayHavingTag, tagName);
            console.log(``);
        };
    },
    // tag를 가진 task 출력함수
    loopHavingTagArray(arrayHavingTag, tagName) {
        for (let obj of arrayHavingTag) {
            if (obj.tag === tagName && obj.state === 'done') {
                console.log(` - ${obj.id}번, ${obj.name}, [${obj.state}], ${obj.turnaroundTime}`);
            } else if (obj.tag === tagName) {
                console.log(` - ${obj.id}번, ${obj.name}, [${obj.state}]`);
            }
        }
    },
    // 원하는 state의 task 출력함수
    show(str) {
        const states = str.toLowerCase().match(/\btodo|doing|done/g);
        if (states) {
            let userWantStateArray;
            userWantStateArray = this.checkArrayStates(states);
            if (this.cehckNullState(userWantStateArray, states)) return;
            this.checkStateDone(userWantStateArray);
        } else {
            console.log('state 값을 제대로입력해주세요(todo/doing/done)')
        }
    },
    // show메서드에서 done 입력시 완료시간까지 표시하기위해 실행된다.
    checkStateDone(userWantStateArray) {
        if (userWantStateArray[0].state === 'done') {
            this.doneArrayPrint(userWantStateArray);
        } else {
            this.arrayPrint(userWantStateArray);
        };
    },
    // 원하는 state의 task가 없을때 실행되는 오류체크 함수
    cehckNullState(arr, states) {
        if (arr.length === 0) {
            console.log(` '${states}' 상태인 스케줄이 없습니다.`)
            return true;
        }
        return false;
    },
    // 원하는 상태의 값의 task 저장
    checkArrayStates(state) {
        let todo, doing, done;
        [todo, doing, done] = this.filteringStates(this.taskArray);
        return {
            todo: todo,
            doing: doing,
            done: done
        }[state];
    },
    // 원하는 array를 출력해준다
    arrayPrint(arr) {
        arr.forEach(v => {
            if (v.tag.length === 0) {
                console.log(` - ${v.id}번, ${v.name}`);
            } else {
                console.log(` - ${v.id}번, ${v.name}, [${v.tag}]`);
            }
        });
    },
    // done 상태일때의 출력함수
    doneArrayPrint(arr) {
        arr.forEach(v => {
            if (v.tag.length === 0) {
                console.log(` - ${v.id}번, ${v.name}, 완료시간 : ${v.turnaroundTime}`);
            } else {
                console.log(` - ${v.id}번, ${v.name}, [${v.tag}], 완료시간 : ${v.turnaroundTime}`);
            }
        });
    }
};

// taskProgram.add({ name: '친구만나기' });
// taskProgram.undo();
// taskProgram.add({ name: '숨쉬기', tag: 'working' });
// taskProgram.undo();
taskProgram.add({ name: '똥싸기' });
taskClipBoard.undo()
taskClipBoard.redo()
// taskProgram.add({ name: '밥먹기', tag: 'Work ing' });
// taskProgram.add({ name: '밥먹 기' });
// taskProgram.add({ name: '손씻기', tag: 'prog    raming' });
// taskProgram.add({ name: '콜라먹기', tag: 'Drinking' });
// taskProgram.update({ id: 0, nextstatus: '      Doing' });
// taskProgram.update({ id: 0, nextstatus: 'done' })
// taskProgram.update('         2$done')
// taskProgram.update({ id: 2, nextstatus: 'd oing' });
// taskProgram.update({ id: 2, nextstatus: '   don   e' });
// taskProgram.update({ id: 2, nextstatus: 'donE' });
// taskProgram.remove({ id: 144 });
// taskProgram.undo();
// taskProgram.showTag('workinG')
// taskProgram.showTags();
// taskProgram.show('   done      ');
// taskProgram.showAll();

