const isValidId = function (idNum) {
    if (idNum) {
        return true;
    } else {
        console.log('invalid idNumber');
        console.log('idNumber is five digits')
        return false;
    }
}


const isValidStatus = function (status) {
    if (status) {
        return true;
    } else {
        console.log('invalid status');
        console.log('<todo, doing, done>');
        return false;
    }
}


const isValidName = function (name) {
    if (name) {
        return true;
    } else {
        console.log('invalid name');
        console.log('name is not a number');
        return false;
    }
}


const isValidTag = function (tag) {
    if (tag) {
        return true;
    } else {
        console.log('invalid tag');
        console.log('tag is only English\tex)["<English>"]');
        return false;
    }
}


module.exports = {
    isValidId,
    isValidStatus,
    isValidName,
    isValidTag
}