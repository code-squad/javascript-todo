const processData = require('./process_data');

// 1 ~ 9999 까지
const getRandomID = () => { 
    const limitLength = 9999;
    const IdList = processData.getIdListByTodoList();
    if (IdList.length >= limitLength) return limitLength+1;
    while (true) {
        const randomID = Math.floor(Math.random() * limitLength) + 1;
        let isExistsRandomID = false;
        for (const value of IdList) {
            if (value === randomID) {
                isExistsRandomID = true;
                break;
            }
        }
        if (!isExistsRandomID) return randomID;
    }
}

module.exports = {
    getRandomID,
}