var readline = require('readline');
var interpreter = require('./interpreter');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(input) {
    interpreter.execute(input);
});
