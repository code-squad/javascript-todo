const Controller = require('./controller');
const readLine = require('readline');
const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    rl.on('line', (input) => {
        const controller = new Controller();
        controller.instruct(input);
    });
})();
