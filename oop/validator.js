const validator = {
    isContained: (string, key) => {
        return string.includes(key)
    },

    isExisted: (arr, id) => {
        if (!Number.isFinite(id)) return false;
        return arr.findIndex((el) => el.id === id)
    },
    isSameStatus: (obj, status) => {
        return obj["status"] === status
    },
    isCorrectStatus: (status) => {
        const reg = /^done$|^doing$|^todo$/
        return reg.test(status)
    },
    isCorrectCommand: (inst) => {
        const reg = /^add$|^delete$|^show$|^update$/
        return reg.test(inst)
    },

    checkTagShape: (tag) => {
        const reg = new RegExp(/(^\[(("[a-z0-9]+")|('[a-z0-9]+'))\]$)|(^\[((("[a-z0-9]+")|('[a-z0-9]+')),\s*)+(("[a-z0-9]+")|('[a-z0-9]+'))\]$)/gi)
        return !reg.test(tag)
    }
}


module.exports = validator