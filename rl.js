var rl = (function () {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return rl;
})();

module.exports = rl;