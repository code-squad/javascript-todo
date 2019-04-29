const todoList = require('./data.js');

const ErrorCheck = function() {}

ErrorCheck.prototype.syntaxError = function(input) {
    let firstWord = input.match(/\w+/); 
    let seperator = input.match(/\$/g); 
    let zeroSeperator = (seperator===null);
    if(zeroSeperator === true){
        return false;
    }else{
        let oneSeperator = ((firstWord[0] === "delete" || firstWord[0] === "show") && (seperator.length===1));
        let twoSeperator = ((firstWord[0] === "add" || firstWord[0] === "update") && (seperator.length===2));
        return oneSeperator || twoSeperator ? true : false;
    }
    
}
ErrorCheck.prototype.unknownIDError = function(ID) {
    if(ID === NaN) {
        return false;
    } 
    return !(todoList.filter(v => v["id"] === ID).length === 0) ? true : false;
}
ErrorCheck.prototype.duplicatedStatusError = function(ID, status) {
    return !(todoList.filter(v => v["id"] === ID)[0]["status"] === status) ? true : false;
}




module.exports = {
    ErrorCheck
}