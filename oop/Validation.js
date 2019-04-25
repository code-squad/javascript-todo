function Validation(){}

Validation.prototype.isContained = function(string, key) {
    return string.includes(key)
}

Validation.prototype.isExisted = function(arr, id) {
    if (!Number.isFinite(id)) return false;
    return arr.findIndex((el) => {el.id === id}) === -1 ? false : true
}

Validation.prototype.isSameStatus = function(obj, status) {
    return obj.status !== status
}

// 인자의 수가 부족 

// 명령어가 잘못된 경우

// 태그 ["ㅇㄴㅇ", "ㄴㅇㄴㅇㄴ"]

