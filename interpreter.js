var app = require('./app');
var statusConstant = require('./common').statusConstant;

var interpreter = {
    commandList: [
        {
            name: 'show',
            validate: function (params) {
                var status = params[0];

                if (params.length !== 1) {
                    return false;
                }

                return statusConstant.getList().indexOf(status) > -1;
            }
        },
        {
            name: 'add',
            validate: function(params) {
                return params.length === 1;
            }
        },
        {
            name: 'update',
            validate: function(params) {
                if (params.length !== 2) {
                    return false;
                }

                var id = params[0];
                var status = params[1];

                return /^\+?(0|[1-9]\d*)$/.test(id) &&
                 statusConstant.getList().indexOf(status) > -1;
            }
        }
    ],
    validate: function(tokens) {
        var commandIndex = this.commandList.findIndex(function (item) {
            return item.name === commandName;
        });

        if (commandIndex === -1) {
            return false;
        }

        return this.commandList[commandIndex].validate(params);
    },
    execute: function(input) {
        var parmas = input.split('$');
        var commandName = parmas.splice(0, 1)[0];

        var isValidInput = this.validate(commandName, parmas);
        if (!isValidInput) {
            throw '명령어 형식이 올바르지 않습니다.';
        }

        return {
            commandName: commandName,
            params: parmas
        }
    }
}

module.exports = interpreter;
