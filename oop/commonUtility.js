
module.exports = ComUtil = function(datalist, inputReadline) {
    this.datalist = datalist;
    this.inputReadline = inputReadline;
}
ComUtil.prototype.splitInput = function(inputData) {
        const splitOnDollarSymbol = inputData.split("$");
        return splitOnDollarSymbol;
    },

ComUtil.prototype.printError = function() {
        console.error('입력하신 값이 존재하지않습니다. \n');
        this.inputReadline.prompt();
        return;
    },


ComUtil.prototype.getIndex = function(inputId) {
    return this.datalist.map((element) => { return element["id"] }).indexOf(inputId);
},


ComUtil.prototype.checkStatus = function(objData, status) {
    return objData.filter(list => list.status === status).map(list => { return list.name });
},


ComUtil.prototype.createNewID = function(datalist, maxNumOfID) {
    const newID = Math.floor(Math.random() * maxNumOfID) + 1;
    const checkDuplicatedID = this.checkID(newID);
    if (typeof checkDuplicatedID !== 'undefined') createNewID(datalist, maxNumOfID);

    return newID;
},


ComUtil.prototype.checkID = function(inputID) {
    const [matchedListByID] = this.datalist.filter(list => {
        return list.id == inputID
    })
    return matchedListByID;
},


ComUtil.prototype.checkDuplicatedStatus = function(currentIndex, updatedStatus) {
    if (this.datalist[currentIndex].status === updatedStatus) {
        console.log('입력한 상태와 동일한 상태입니다')
        return true;
    }
}

