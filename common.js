var statusConstant = {
    TODO: 'todo',
    DOING: 'doing',
    DONE: 'done'
};

statusConstant.getList = (function () {
    var keyList = Object.keys(this);
    var propertyList = keyList.map(function (item) {
        return this[item];
    }.bind(this));

    return function() {
        return propertyList;
    }
}).call(statusConstant);

module.exports.statusConstant = statusConstant;
