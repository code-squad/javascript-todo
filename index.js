const taskProgram = {
    taskArray: [],
    taskCount: 0,
    setTimeArray: [2000, 5000, 7000],
    add(obj) {
        const newTodo = Object.create({});
        this.checkTag(obj);
        [newTodo.id, newTodo.name, newTodo.tag, newTodo.state] = [taskProgram.taskCount, obj.name.toLowerCase(), obj.tag.toLowerCase(), 'todo'];
        this.increaseTaskCount();
        this.taskArray.push(newTodo);
        return [console.log(`id : ${newTodo.id}, "${obj.name}" 항목이 추가 되었습니다.`), taskProgram.showState()];
    },
    // 태그값이 없을시 초기값부여
    checkTag(obj) {
        if (obj.tag === undefined) obj.tag = '';
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
    // 초기값 n = 0 으로 받아 loopConsoleLog를 시간차로 실행
    settime(n, statesArray, setTimeArray) {
        let time = (setTimeArray[n + 1] - setTimeArray[n] ) / 1000;
        if (n > 2) return;
        else {
            setTimeout(() => {
                this.loopConsoleLog(statesArray[n]);
                if (n >= 2) return;
                console.log(`지금부터 ${time}초뒤 ${statesArray[n][0].state}출력....`);
            }, setTimeArray[n]);
            return this.settime(n + 1, statesArray, setTimeArray)
        }
    },
    update(obj) {
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
    },
    checkState(obj) {
        const changedstate = obj.nextstatus.toLowerCase()
        if (changedstate === 'doing') {
            const startTime = new Date('6/10/2018 4:20 pm');
            this.taskArray[obj.id].startTime = startTime
        } else if (changedstate === 'done') {
            // test용 시간 입력 사용시 new Date()로 사용
            const endTime = new Date('6/11/2018 3:20 pm');
            this.taskArray[obj.id].endTime = endTime
            this.setTurnaroundTime(obj)
        }
    },
    setTurnaroundTime(obj) {
        let turnaroundTime, endT, startT
        [endT, startT] = [this.taskArray[obj.id].endTime, this.taskArray[obj.id].startTime]
        turnaroundTime = endT - startT
        this.taskArray[obj.id].turnaroundTime = turnaroundTime;
        this.getTime(obj);
    },
    getTime(obj) {
        let turnaroundTime = this.taskArray[obj.id].turnaroundTime
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
        this.taskArray[obj.id].turnaroundTime = removedZeroTime;
    },
    removeZeroTime(timeString) {
        removedZeroTime = timeString.match(/[1-9]{1,3}[가-힣]{1,2}/g).join(' ')
        return removedZeroTime;
    },
    remove(obj) {
        const removedtodo = this.taskArray.splice(this.taskArray[obj.id].id, 1);
        return console.log(`id : ${removedtodo[0].id}, "${removedtodo[0].name}" 삭제완료.`);
    },
    showTag(string) {
        if (this.classifyArgument(string)) {
            const classifiedArray = this.classifyArgument(string);
            const filteredArray = this.filteringStates(classifiedArray);
            let todo, doning, done
            [todo, doning, done] = filteredArray;
            this.loopConsoleLog(todo);
            this.loopConsoleLog(doning);
            this.loopConsoleLog(done);
        };
    },
    classifyArgument(paramaeter) {
        const filteredArray = this.taskArray.filter(v => v.tag === paramaeter.toLowerCase());
        if (filteredArray.length === 0) return false;
        if (filteredArray.length !== 0) return filteredArray;
    },
    loopConsoleLog(array) {
        if (array.length === 0) console.log('항목이 없습니다.')
        array.name = array[0].state;
        console.log(`[ ${array.name}, 총 ${array.length}개 ]`);
        if (array.name === 'done') return this.doneArrayConsolelog(array);
        array.forEach(v => {
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
            this.doneArrayConsolelog(userWantStateArray);
        } else {
            this.arrayConsoleLog(userWantStateArray);
        };
    },
    cehckNullState(array, states) {
        if (array.length === 0) {
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
    arrayConsoleLog(array) {
        array.forEach(v => {
            if (v.tag.length === 0) {
                console.log(` - ${v.id}번, ${v.name}`);
            } else {
                console.log(` - ${v.id}번, ${v.name}, [${v.tag}]`);
            }
        });
    },
    doneArrayConsolelog(array) {
        array.forEach(v => {
            if (v.tag.length === 0) {
                console.log(` - ${v.id}번, ${v.name}, 완료시간 : ${v.turnaroundTime}`);
            } else {
                console.log(` - ${v.id}번, ${v.name}, [${v.tag}], 완료시간 : ${v.turnaroundTime}`);
            }
        });
    }
};

taskProgram.add({ name: '친구만나기' });
taskProgram.add({ name: '숨쉬기', tag: 'working' });
taskProgram.add({ name: '밥먹기', tag: 'Working' });
taskProgram.add({ name: '손씻기', tag: 'programing' });
taskProgram.add({ name: '콜라먹기', tag: 'Drinking' });
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