const processData = require('./process_data');

// 비동기로 처리..show all..
const showCompletionStatus = (milliSecond) => {
    setTimeout( () => { controlCommand('show', ['all']); }, milliSecond );
}

const checkparamArr = (command, paramArr) => { 
    switch(command) {
        case 'show': case 'delete': return paramArr.length === 1;
        case 'add':  case 'update': return paramArr.length === 2;
    }
}

const checkCommand = (currentCommand) => {
    return ['show', 'add', 'delete', 'update'].some( (command) => { return currentCommand === command } );
}

const checkStatus = (currentStatus) => {
    return ['all', 'todo', 'doing', 'done'].some( (status) => { return currentStatus === status } );
}

const checkIdForm = (id) => { return isNaN(id) ? false : true; }

const checkTagForm = (tag) => { return tag.match(/(?<=\[\")[a-z]*(?=\"\])/i) !== null; }

const processQuery = {
    'show': (paramArr) => {
        if (!checkparamArrLength(paramArr, 1)) {
            console.log(`올바른 명령어가 아닙니다.`);
            return false;
        }

        if (!checkStatusCommand(paramArr[0])) {
            console.log(`${paramArr[0]} 는 존재하지 않는 상태입니다.`);
            return false;
        }

        let strTodoList  = "";
        const viewType   = paramArr[0];
        const statusList = processData.getStatusListByTodoList();
        if (viewType === 'all') {
            strTodoList = `현재 상태 : todo: ${statusList['todo'].length}개,`
                        + `doing: ${statusList['doing'].length}개,`
                        + `done: ${statusList['done'].length}개`;
        } else {
            strTodoList = `${viewType} 리스트 : 총 ${statusList[viewType].length}건:`
                        + `${statusList[viewType]}`;
        }

        console.log(strTodoList);
        return true;
    },

    'add': (paramArr) => {
        if (!checkparamArrLength(paramArr, 2)) {
            console.log(`올바른 명령어가 아닙니다.`);
            return false;
        }

        if(paramArr[1].match(/(?<=\[\")[a-z]*(?=\"\])/i) === null) {
            console.log(`tag 입력 형식이 잘못되었습니다.`);
            return false;
        }

        const id = processData.getRandomID();
        const inputName = paramArr[0];
        const inputTag  = paramArr[1].split('["').join('').split('"]').join('');
        const inputData = {'name': inputName, 'tags': [inputTag], 'status': 'todo', 'id': id};
        console.log(`${inputName} 1개가 추가되었습니다.(id : ${id})`);
        processData.saveTodoList(inputData, 'add');
        // 비동기로 1초 뒤에 show all
        showCompletionStatus();
        return true;
    },

    'delete': (paramArr) => {
        if (!checkparamArrLength(paramArr, 1)) {
            console.log(`올바른 명령어가 아닙니다.`);
            return false;
        }

        if (!checkIdForm(paramArr[0])) {
            console.log(`id 형식의 입력이 잘못되었습니다. ( ${paramArr[0]} )`);
            return false;
        }

        const id = parseInt(paramArr[0]);
        const idList = processData.getIdListByTodoList();
        for(let index = 0; index < idList.length; index++) {
            if (id === idList[index]) {
                const [name, status] = processData.getNameAndStatusById(id);
                console.log(`${name} ${status} 가 목록에서 삭제됐습니다.`);
                processData.saveTodoList(index, 'delete');
                // 비동기로 1초 뒤에 show all
                showCompletionStatus();
                return true;
            }
        }

        console.log(`id ${id} 은(는) 존재하지 않습니다.`);
    },

    'update': (paramArr) => {
        if (!checkparamArrLength(paramArr, 2)) {
            console.log(`올바른 명령어가 아닙니다.`);
            return false;
        }

        if (!checkIdForm(paramArr[0])) {
            console.log(`id 형식의 입력이 잘못되었습니다. ( ${paramArr[0]} )`);
            return false;
        }

        if (!checkStatusCommand(paramArr[1])) {
            console.log(`${paramArr[1]} 는 존재하지 않는 상태입니다.`);
            return false;
        }

        const id = parseInt(paramArr[0]);
        const currentStatus = paramArr[1];
        const idList = processData.getIdListByTodoList();
        for (let index = 0; index < idList.length; index++) {
            if (id === idList[index]) {
                const [name] = processData.getNameAndStatusById(id);
                processData.saveTodoList([index, currentStatus], 'update');
                // 비동기로 3초 뒤에 결과 메시지 출력
                setTimeout( () => { 
                    console.log(`${name}가 ${currentStatus} (으)로 상태가 변경됐습니다.`);
                    // 비동기로 1초 뒤에 show all
                    showCompletionStatus();
                } , 3000 );
                return true;
            }
        }

        console.log(`id ${id} 은(는) 존재하지 않습니다.`);
    },
}

module.exports = processQuery;