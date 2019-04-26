function Validation(){}

Validation.prototype.isContained = function(string, key) {
    return string.includes(key)
}

Validation.prototype.isExisted = function(arr, id) {
    if (!Number.isFinite(id)) return false;
    return arr.findIndex((el) => el.id === id)
}

Validation.prototype.isSameStatus = function(obj, status) {
    return obj["status"] === status
}

Validation.prototype.isCorrectStatus = function(status) {
    const reg = /^done$|^doing$|^todo$/
    return reg.test(status)
}

Validation.prototype.isCorrectCommand = function(inst) {
    const reg = /^add$|^delete$|^show$|^update$/
    return reg.test(inst)
}

Validation.prototype.checkTagShape = function(tag) {
    const reg = new RegExp(/(^\[(("[a-z0-9]+")|('[a-z0-9]+'))\]$)|(^\[((("[a-z0-9]+")|('[a-z0-9]+')),\s*)+(("[a-z0-9]+")|('[a-z0-9]+'))\]$)/gi)
    return !reg.test(tag)
}


module.exports = Validation

