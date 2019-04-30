const todoList = require('./data.js');

const ErrorCheck = class {
    syntaxError(input) {
        let firstWord = input.match(/\w+/); 
        let seperator = input.match(/\$/g); 
        let zeroSeperator = (seperator===null);
        if(zeroSeperator === true && !(firstWord[0] ==="undo" || firstWord[0] === "redo")) {
            return false;
        }else{
            let zeroSeperator = (firstWord[0] ==="undo" || firstWord[0] === "redo");
            let oneSeperator = ((firstWord[0] === "delete" || firstWord[0] === "show") && (seperator.length===1));
            let twoSeperator = ((firstWord[0] === "add" || firstWord[0] === "update") && (seperator.length===2));
            return zeroSeperator || oneSeperator || twoSeperator ? true : false;
        }
        
    }
    unknownIDError(ID) {
        if(ID === NaN) {
            return false;
        } 
        return !(todoList.filter(v => v["id"] === ID).length === 0) ? true : false;
    }
    duplicatedStatusError(ID, status) {
        return !(todoList.filter(v => v["id"] === ID)[0]["status"] === status) ? true : false;
    }
}





module.exports = {
    ErrorCheck
}