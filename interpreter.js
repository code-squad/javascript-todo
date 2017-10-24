var app = require('./app');
var statusConstant = require('./common').statusConstant;

var interpreter = {
    commandList: ['todo', 'doing', 'done'],
    validator: {
        show: function(params) {
            var status = params[0];

            if (params.length !== 1) {
                return false;
            }

            return statusConstant.getList().indexOf(status) > -1;
        },
        add: function(params) {
            return params.length === 1;
        },
        update: function(parmas) {
            if (params.length !== 2) {
                return false;
            }

            var id = params[0];
            var status = params[1];

            return /^\+?(0|[1-9]\d*)$/.test(id) &&
             statusConstant.getList().indexOf(status) > -1;
         }
    },
    validate: function(commandName, params) {
        var commandIndex = this.commandList.findIndex(function (item) {
            return item.name === commandName;
        });

        if (commandIndex === -1) {
            return false;
        }

        return this.validator[commandName](params);
    },
    execute: function(input) {
        var parmas = input.split('$');
        var commandName = parmas.splice(0, 1)[0];

        var isValidInput = this.validate(commandName, parmas);
        if (!isValidInput) {
            throw new Error('명령어 형식이 올바르지 않습니다.');
        }

        return {
            commandName: commandName,
            params: parmas
        }
    }
}

module.exports = interpreter;
