var command = {
    SHOW: 'show',
    ADD: 'add',
    UPDATE: 'update'
};

var status = {
    TODO: 'todo',
    DOING: 'doing',
    DONE: 'done'
};

var getList = function() {
    var keyList = Object.keys(this);
    var propertyList = keyList.map(function (item) {
        return this[item];
    }.bind(this));

    return function() {
        return propertyList;
    }
};

command.getList = getList.call(command);
status.getList = getList.call(status);

module.exports.command = command;
module.exports.status = status;
