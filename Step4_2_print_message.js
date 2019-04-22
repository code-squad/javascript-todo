
const errorMessage = (keyword) => {
    switch(keyword) {
        case 'command'      : console.log(`존재하지 않는 명령어 입니다. (show, add, delete, update)`); break;
        case 'paramArr'     : console.log(`인자 값의 형식이 올바르지 않습니다.`); break;
        case 'status'       : console.log(`존재하지 않는 상태 입니다. (doing, done, todo)`); break;
        case 'id'           : console.log(`ID 형식이 올바르지 않습니다.`); break;
        case 'tag'          : console.log(`tag 형식이 올바르지 않습니다.`); break;
        case 'Id Full'      : console.log(`TODO List가 꽉 차있습니다. 비워주세요.`); break;
        case 'Not Exist Id' : console.log(`존재하지 않는 ID 입니다.`); break;
    }
    return false;
}

const completeShowMessage = (viewType, statusList) => {
    let strTodoList = "";
    if (viewType === 'all') {
        strTodoList = `현재 상태 : todo: ${statusList['todo'].length}개,`
                    + `doing: ${statusList['doing'].length}개,`
                    + `done: ${statusList['done'].length}개`;
    } else {
        strTodoList = `${viewType} 리스트 : 총 ${statusList[viewType].length}건:`
                    + `${statusList[viewType]}`;
    }
    console.log(strTodoList);
}

const completeAddMessage = (inputName, id) => {
    console.log(`${inputName} 1개가 추가되었습니다.(id : ${id})`);
}

const completeDeleteMessage = (name, status) => {
    console.log(`${name} ${status}가 목록에서 삭제됐습니다.`);
}
    
const completeUpdateMessage = (name, currentStatus) => {
    console.log(`${name}가 ${currentStatus} (으)로 상태가 변경됐습니다.`);
}

module.exports = { 
    errorMessage,
    completeShowMessage,
    completeAddMessage,
    completeDeleteMessage,
    completeUpdateMessage,
};