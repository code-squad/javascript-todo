var model = require('./model');
var statusConstant = require('./common').statusConstant;

var interpreter = {
    commandList: {
        show: {
            validate: function(tokens) {
                //show 명령어 parameter 개수는 1개
                //parameter는 status 값 ('todo' OR 'doing' OR 'done')

                var status = tokens[0];
                var statusList = statusConstant.getList();

                if (tokens.length !== 1) {
                    return false;
                }

                return statusList.indexOf(status) > -1;
            }
        },
        add: {
            validate: function(tokens) {
                return tokens.length === 1;
            }
        },
        update: {
            validate: function(tokens) {
                //첫 번째 parameter는 정수 (id)
                //두 번째 parameter는 status 값 ('todo' OR 'doing' OR 'done')

                var statusList = statusConstant.getList();

                if (tokens.length !== 2) {
                    return false;
                }

                var id = tokens[0];
                var status = tokens[1];

                return /^\+?(0|[1-9]\d*)$/.test(id) && statusList.indexOf(status) > -1;
            }
        }
    },
    validate: function(tokens) {
        var command = tokens[0];
        var isValidCommand = commandList.hasOwnProperty(command);

        tokens.shift(); //remove first element

        return isValidCommand && commandList[command].validate(tokens);
    },
    execute: function(input) {
        var tokens = input.split('$');
        var command = tokens[0];

        var isValidInput = validate(tokens);
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
    }
}

module.exports = interpreter;
