const isValidId = function (idNum) {
    if (idNum) {
        return true;
    } else {
        console.log("invalid idNumber");
        console.log("idNumber is five digits");
        return false;
    }
};

const isValidStatus = function (status) {
    if (status) {
        return true;
    } else {
        console.log("invalid status");
        console.log("<todo, doing, done>");
        return false;
    }
};

const isValidName = function (name) {
    if (name) {
        return true;
    } else {
        console.log("invalid name");
        console.log("name is not a number");
        return false;
    }
};

const isValidTag = function (tag) {
    if (tag) {
        return true;
    } else {
        console.log("invalid tag");
        console.log('tag is only English with standard form  ex)["<English>"]');
        return false;
    }
};

const ranNum = function (digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const isDuplicateNum = function (todos, ranId) {
    return todos.some((el) => el['id'] === ranId)
};

const makeRanNum = function(digits, todos){
    let ranId = ranNum(digits);
        if(!isDuplicateNum(todos, ranId)){
        return ranId;
        }else {
        return makeRanNum(digits, todos);
        }
}


module.exports = {
    isValidId,
    isValidStatus,
    isValidName,
    isValidTag,
    makeRanNum
};
