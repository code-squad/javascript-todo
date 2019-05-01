module.exports = UndoableApp = function (datalist, inputReadline) {
    this.datalist = datalist;
    this.command = undefined;
    this.save = false;
    this.past = [];
    this.present = [];
    this.future = [];
    this.storeCommand = [];
    this.inputReadline = inputReadline;
}


UndoableApp.prototype.undoable = function (command, splicedData) {
    this.past.push(splicedData);
    this.command = command;
},

UndoableApp.prototype.manageMaxLengthOfPastArr = function (maxPastArrayLength) {
    if (this.past.length < maxPastArrayLength) {
        return
    }
    else {
        this.past.shift();
        this.manageMaxLengthOfPastArr();
    }
},

UndoableApp.prototype.initSaveCommandAfterUndo = function () {
    if (this.storeCommand.length != 0) {
        this.storeCommand = [];
    }
},

UndoableApp.prototype.saveCommandAfterUndo = function (command) {
    if (this.save) {
        this.storeCommand.push(command);
    }
},

UndoableApp.prototype.undo = function () {

    if (this.past.length === 0) {
        console.log('\n undo할 값이 없습니다!');
        this.inputReadline.prompt();
        return;
    }

    const popPastValue = this.past.pop();

    if (this.present.length === 1) {
        this.future.push(this.present.pop());
        this.present.push(popPastValue);
    } else {
        this.present.push(popPastValue);
    }

    if (this.command === 'add') {
        this.datalist.pop();
        console.log(`\n ${popPastValue.id}번 항목 ${popPastValue.name}가 식제됐습니다.`);
    }
    else if (this.command === 'update') {
        this.datalist[popPastValue.currentIndex].status = popPastValue.beforeUpdatedStatus;
        console.log(`\n ${datalist[popPastValue.currentIndex].id}번 항목 ${datalist[popPastValue.currentIndex].name}가 ${datalist[popPastValue.currentIndex].status}상태로 변경이 취소되었습니다.`);
    }
    else {
        this.datalist.push(popPastValue);
        console.log(`\n ${popPastValue.id}번 항목 ${popPastValue.name}가 삭제에서 ${popPastValue.status}상태로 변경되었습니다.`);
    }

    this.initSaveCommandAfterUndo();
    this.inputReadline.prompt();

    return;
},

UndoableApp.prototype.redo = function () {    
    // undo 하고 add를 하고 redo한 경우 redo가 안 된다.
    if(this.storeCommand.length != 0){
        this.save = false;
    }

    // undo 실행 전에는 redo가 안 된다.
    if (this.save === false) {
        console.log('\n redo할 값이 없습니다1!');
        this.inputReadline.prompt();
        return;
    }
    
    // present[0]에 값이 없으면 redo가 안 된다.
    if (this.present[0] === undefined) {
        console.log('\n redo할 값이 없습니다2!');
        this.inputReadline.prompt();
        return;
    }

    const popPresentValue = this.present.pop();

    this.past.push(popPresentValue);
    this.present.push(this.future.pop());

    if (this.command === 'add') {
        this.datalist.push(popPresentValue);
        console.log(`\n ${popPresentValue.name} 1 개가 추가됐습니다.(id : ${popPresentValue.id})`);
    }
    else if (this.command === 'update') {
        this.datalist[popPresentValue.currentIndex].status = popPresentValue.updatedStatus;
        console.log(`\n ${this.datalist[popPresentValue.currentIndex].name} 가 ${this.datalist[popPresentValue.currentIndex].status}로 상태가 변경됬습니다.`);
    }
    else {
        this.datalist.pop();
        console.log(`\n ${popPresentValue.id}번 항목 ${popPresentValue.name}가 ${popPresentValue.status}상태에서 삭제되었습니다.`);
    }

    this.inputReadline.prompt();
    return;
}
