const regexObj = {
    status : /^done$|^doing$|^todo$/,
    command: /^add$|^delete$|^show$|^update$|^undo$|^redo$/,
    tag: /(^\[(("[a-z0-9]+")|('[a-z0-9]+'))\]$)|(^\[((("[a-z0-9]+")|('[a-z0-9]+')),\s*)+(("[a-z0-9]+")|('[a-z0-9]+'))\]$)/i
}

const validator = {
    isContained: (string, key) => {
        return string.includes(key)
    },
    isExisted: (arr, id) => {
        if (!Number.isFinite(id) || arr.length === 0) return -1;
        return arr.findIndex((el) => el.id === id)
    },
    isSameStatus: (obj, status) => {
        return obj["status"] === status
    },
    isCorrectStatus: (status) => {
        return regexObj.status.test(status)
    },
    isCorrectCommand: (inst) => {
        return regexObj.command.test(inst)
    },
    checkTagShape: (tag) => {
        let result = regexObj.tag.test(tag)
        console.log(tag)
        console.log(result)
        console.log(!result)
        return !result
    }
}


module.exports = validator