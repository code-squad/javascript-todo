let model = require('./model');
const statusList = ['todo', 'doing', 'done'];

const commandList = {
    show: {
        validate: (tokens) => {
            //show 명령어 parameter 개수는 1개
            //parameter는 status 값 ('todo' OR 'doing' OR 'done')

            let status = tokens[0];

            if (tokens.length !== 1) {
                return false;
            }

            return statusList.indexOf(status) > -1;
        }
    },
    add: {
        validate: (tokens) => {
            return tokens.length === 1;
        }
    },
    update: {
        validate: (tokens) => {
            //첫 번째 parameter는 정수 (id)
            //두 번째 parameter는 status 값 ('todo' OR 'doing' OR 'done')

            if (tokens.length !== 2) {
                return false;
            }

            let id = tokens[0];
            let status = tokens[1];

            return /^\+?(0|[1-9]\d*)$/.test(id) && statusList.indexOf(status) > -1;
        }
    }
};

let validate = function(tokens) {
    let command = tokens[0];
    let isValidCommand = commandList.hasOwnProperty(command);

    tokens.shift(); //remove first element

    return isValidCommand && commandList[command].validate(tokens);
}

exports.execute = function(input) {
    let tokens = input.split('$');
    let command = tokens[0];

    let isValidInput = validate(tokens);
    if (!isValidInput) {
        console.log('명령어 형식이 올바르지 않습니다.');
        return false;
    }

    try {
        // 첫 번째 토큰인 command가 validate method에서 삭제 된 상태
        model[command].apply(null, tokens);
    } catch (exception) {
        console.log(exception);
    }
};
