const readline = require('readline');
const interpreter = require('./interpreter');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    interpreter.execute(input);
});
