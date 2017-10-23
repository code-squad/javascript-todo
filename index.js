var readline = require('readline');
var interpreter = require('./interpreter');
var app = require('./app');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(input) {
    try {
        var result = interpreter.execute(input);
        app[result.commandName].apply(app, result.params);
    } catch(exception) {
        console.log(exception);
    }
});
