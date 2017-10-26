var app = require('./app');

var constants = require('./constants');
var polyfill = require('./utils').polyfill;
var statusConstant = constants.status;
var commandConstant = constants.command;

var interpreter = {
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
        update: function(params) {
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
        var commandIndex = polyfill.findIndex(commandConstant.getList(), function (item) {
            return item === commandName;
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
