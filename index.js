const taskProgram = {
    taskArray: [],
    taskCount: 0,
    removeCount: 0,
    setTimeArray: [2000, 5000, 7000],
    clipBoard: Object.seal(new Array(3).fill(undefined)),
    //  클립보드에 실행된 함수의 함수와, 인자를 클립보드에 저장하는 함수
    addclip(name, argument, id) {
        const Savedfunc = Object.create({});
        [Savedfunc.function, Savedfunc.argument, Savedfunc.id] = [name, argument, id];
        if (this.clipBoard[0] === undefined) {
            this.clipBoard[0] = Savedfunc;
        } else {
            this.unshiftClip(Savedfunc, 2)
        }
    },
    // clipBoard 배열의 값을 밀어내주는 함수
    unshiftClip(obj, n) {
        if (n === 0) return this.clipBoard[0] = obj
        else {
            this.clipBoard[n] = this.clipBoard[n - 1]
            return this.unshiftClip(obj, n - 1)
        }
    },
    //  클립보드 어레이의 가장최근실행된 0번째 함수를 재실행
    redo() {
        let redofunc = this.clipBoard[0].function.bind(taskProgram)
        redofunc(this.clipBoard[0].argument);
    },
    undo() {
        const obj = this.clipBoard[0]
        if (obj.function.name === 'add') {
            this.remove({ id: obj.id })
        }
    },
    add(obj) {
        if (this.checkName(obj)) {
            const newTodo = Object.create({});
            this.checkTag(obj);
            [newTodo.id, newTodo.name, newTodo.tag, newTodo.state] =
                [taskProgram.taskCount, obj.name.toLowerCase(), obj.tag.toLowerCase(), 'todo'];
            this.increaseTaskCount();
            this.taskArray.push(newTodo);
            this.addclip(this.add, obj, newTodo.id)
            return [console.log(`id : ${newTodo.id}, "${obj.name}" 항목이 추가 되었습니다.`), taskProgram.showState()];
        }
    },
    // 태그값이 없을시 초기값부여
    checkTag(obj) {
        if (obj.tag === undefined) obj.tag = '';
    },
    checkName(obj) {
        if (obj.name.length === 0) {
            console.log('[Error] name값을 입력해주세요');
            return false;
        } else if (typeof (obj.name) === 'string') {
            for (taskobj of this.taskArray) {
                if (obj.name === taskobj.name) {
                    console.log('[Error] 이미 같은 스케줄이 있서요')
                    return false;
                }
            }
        } return true;
    },
    increaseTaskCount() {
        this.taskCount++;
    },
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
    showAll() {
        let todo, doing, done;
        [todo, doing, done] = this.filteringStates(this.taskArray);
        console.log(`총 ${this.taskCount}개의 스케줄이 있습니다. 2초뒤 Todo출력...`)
        this.settime(0, [todo, doing, done], this.setTimeArray);
    },
    // 초기값 n = 0 으로 받아 loopPrint를 시간차로 실행
    settime(n, statesArray, setTimeArray) {
        let states = ['doing', 'done']
        let time = (setTimeArray[n + 1] - setTimeArray[n]) / 1000;
        if (n > 2) return;
        else {
            setTimeout(() => {
                this.loopPrint(statesArray[n]);
                if (n >= 2) return;
                console.log(`지금부터 ${time}초뒤 ${states[n]}출력....`);
            }, setTimeArray[n]);
            return this.settime(n + 1, statesArray, setTimeArray)
        }
    },
    update(obj) {
        if (this.checkId(obj)) {
            this.checkState(obj);
            let updatedStatus, id, updatedName, pastState;
            [updatedStatus, id] = [obj.nextstatus.toLowerCase(), obj.id];
            this.taskArray.forEach(v => {
                if (v.id === id) {
                    [updatedName, pastState, v.state] = [v.name, v.state, updatedStatus];
                }
            });
            console.log(`id : ${id}, "${updatedName}" 항목이 ${pastState} => ${updatedStatus} 상태로 업데이트 됐습니다 `);
            return this.showState();
        }
    },
    checkId(obj) {
        if (obj.id > this.taskCount) {
            console.log(`[error] ${obj.id}번 아이디는 존재하지 않아요`)
            return false;
        }
        for (task of this.taskArray) {
            if (task.id === obj.id) {
                return true;
            }
        }
        console.log(`[error] ${obj.id}번 아이디는 존재하지 않아요`)
        return false;
    },
    checkState(obj) {
        const changedstate = obj.nextstatus.toLowerCase()
        let sameObj = this.findArray(obj)
        let userWantObj = this.taskArray[this.taskArray.indexOf(...sameObj)]
        if (changedstate === 'doing') {
            const startTime = new Date('6/10/2018 4:20 pm');
            userWantObj.startTime = startTime
        } else if (changedstate === 'done') {
            // test용 시간 입력 사용시 new Date()로 사용
            const endTime = new Date('6/11/2018 3:20 pm');
            userWantObj.endTime = endTime
            this.setTurnaroundTime(userWantObj)
        }
    },
    setTurnaroundTime(userWantObj) {
        let turnaroundTime, endT, startT
        [endT, startT] = [userWantObj.endTime, userWantObj.startTime]
        turnaroundTime = endT - startT
        userWantObj.turnaroundTime = turnaroundTime;
        this.getTime(userWantObj);
    },
    getTime(userWantObj) {
        let turnaroundTime = userWantObj.turnaroundTime
        turnaroundTime /= 1000;
        let seconds = Math.round(turnaroundTime % 60);
        turnaroundTime = Math.floor(turnaroundTime / 60);
        let minutes = Math.round(turnaroundTime % 60);
        turnaroundTime = Math.floor(turnaroundTime / 60);
        let hours = Math.round(turnaroundTime % 24);
        turnaroundTime = Math.floor(turnaroundTime / 24);
        let days = turnaroundTime;
        let totalTime = `${days}일, ${hours}시간, ${minutes}분`
        let removedZeroTime = this.removeZeroTime(totalTime);
        userWantObj.turnaroundTime = removedZeroTime;
    },
    removeZeroTime(timeString) {
        removedZeroTime = timeString.match(/[1-9]{1,3}[가-힣]{1,2}/g).join(' ')
        return removedZeroTime;
    },
    remove(obj) {
        let sameArray = this.findArray(obj);
        const removedtodo = this.taskArray.splice(this.taskArray.indexOf(...sameArray), 1);
        console.log(`id : ${removedtodo[0].id}, "${removedtodo[0].name}" 삭제완료.`);
        this.removeCount++
    },
    findArray(obj) {
        var sameobj = this.taskArray.filter(v => v.id === obj.id)
        return sameobj;
    },
    showTag(string) {
        if (this.classifyArgument(string)) {
            const classifiedArray = this.classifyArgument(string);
            const filteredArray = this.filteringStates(classifiedArray);
            let todo, doning, done
            [todo, doning, done] = filteredArray;
            this.loopPrint(todo);
            this.loopPrint(doning);
            this.loopPrint(done);
        };
    },
    classifyArgument(paramaeter) {
        const filteredArray = this.taskArray.filter(v => v.tag === paramaeter.toLowerCase());
        if (filteredArray.length === 0) return false;
        if (filteredArray.length !== 0) return filteredArray;
    },
    loopPrint(arr) {
        if (arr.length === 0) {
            console.log('항목이 없습니다.')
            return;
        }
        arr.name = arr[0].state;
        console.log(`[ ${arr.name}, 총 ${arr.length}개 ]`);
        if (arr.name === 'done') return this.doneArrayPrint(arr);
        arr.forEach(v => {
            if (v.tag.length === 0) { console.log(` - ${v.id}번, ${v.name}`) }
            else { console.log(` - ${v.id}번, ${v.name}, [${v.tag}]`) };
        });
    },
    numberingOfTags(tagNameArray) {
        const numberOfTags = tagNameArray.reduce((x, y) => {
            x[y] = ++x[y] || 1;
            return x;
        }, {});
        return numberOfTags;
    },
    filteringHavigTag() {
        const arrayHavingTag = this.taskArray.filter(v => v.tag.length > 0);
        return arrayHavingTag;
    },
    showTags() {
        const tagNameArray = [];
        const arrayHavingTag = this.filteringHavigTag();
        arrayHavingTag.forEach(v => tagNameArray.push(v.tag));
        // 중복된 값을 제거해주는Set ...을쓰면 [{중복없는값들}] 에서 [중복없는값들]로 바뀐다.
        const uniqueTagNameArray = [...new Set(tagNameArray)];
        const numberOfTags = this.numberingOfTags(tagNameArray);
        this.loopTagName(uniqueTagNameArray, numberOfTags, arrayHavingTag);
    },
    loopTagName(uniqueTagNameArray, numberOfTags, arrayHavingTag) {
        for (let i = 0; i < uniqueTagNameArray.length; i++) {
            const [tagName, numbertag] = [Object.keys(numberOfTags)[i], numberOfTags[Object.keys(numberOfTags)[i]]];
            console.log(`[${tagName}, 총 ${numbertag}개]`);
            this.loopHavingTagArray(arrayHavingTag, tagName);
            console.log(``);
        };
    },
    loopHavingTagArray(arrayHavingTag, tagName) {
        for (let obj of arrayHavingTag) {
            if (obj.tag === tagName && obj.state === 'done') {
                console.log(` - ${obj.id}번, ${obj.name}, [${obj.state}], ${obj.turnaroundTime}`);
            } else if (obj.tag === tagName) {
                console.log(` - ${obj.id}번, ${obj.name}, [${obj.state}]`);
            }
        }
    },
    show(str) {
        const states = str.replace(/(\s*)/g, "").toLowerCase();
        let userWantStateArray;
        userWantStateArray = this.checkArrayStates(states);
        if (this.cehckNullState(userWantStateArray, states)) return;
        this.checkStateDone(userWantStateArray);
    },
    checkStateDone(userWantStateArray) {
        if (userWantStateArray[0].state === 'done') {
            this.doneArrayPrint(userWantStateArray);
        } else {
            this.arrayPrint(userWantStateArray);
        };
    },
    cehckNullState(arr, states) {
        if (arr.length === 0) {
            console.log(` '${states}' 상태인 스케줄이 없습니다.`)
            return true;
        }
        return false;
    },
    checkArrayStates(state) {
        let todo, doing, done
        [todo, doing, done] = this.filteringStates(this.taskArray);
        return {
            todo: todo,
            doing: doing,
            done: done
        }[state];
    },
    arrayPrint(arr) {
        arr.forEach(v => {
            if (v.tag.length === 0) {
                console.log(` - ${v.id}번, ${v.name}`);
            } else {
                console.log(` - ${v.id}번, ${v.name}, [${v.tag}]`);
            }
        });
    },
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

taskProgram.add({ name: '친구만나기' });
taskProgram.undo();
taskProgram.add({ name: '숨쉬기', tag: 'working' });
taskProgram.undo();
taskProgram.add({ name: '' })
taskProgram.add({ name: '밥먹기', tag: 'Working' });
taskProgram.add({ name: '손씻기', tag: 'programing' });
taskProgram.add({ name: '콜라먹기', tag: 'Drinking' });
taskProgram.undo()
// taskProgram.redo()
taskProgram.update({ id: 0, nextstatus: 'Doing' });
taskProgram.update({ id: 2, nextstatus: 'doing' });
taskProgram.update({ id: 2, nextstatus: 'done' })
// taskProgram.update({ id: 2, nextstatus: 'donE' })
// taskProgram.remove({ id: 0 });
// taskProgram.showTag('workinG');
taskProgram.showTags();
// taskProgram.show('   done      ');
taskProgram.showAll();

/* 발견된 오류 (기능구현후 수정예정)
- nextstatus 를 done 으로 바로 입력시 시작 시간이 NaN이됨
- add, update시 값 유무 체크 필요
*/