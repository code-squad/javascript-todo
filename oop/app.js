const Controller = require('./controller');
const readLine = require('readline');
const rl = readLine.createInterface({
    input:process.stdin,
});

(() => {
    rl.on('line', (input) => {
        const controller = new Controller(input);
        const inputArray = controller.splitInput();
        const command = inputArray[0];
        switch(command) {
            case 'show' :
                const statusShow = inputArray[1];
                controller.show(statusShow);
                break;
            case 'add' :
                const name = inputArray[1];
                const tag = inputArray[2];
                controller.add(name, tag);
                break;
            case 'delete' :
                const idDelete = inputArray[1];
                controller.delete(idDelete);
                break;
            case 'update' :
                const idUpdate = inputArray[1];
                const statusUpdate = inputArray[2];
                controller.update(idUpdate, statusUpdate);
                break;
        }
    });
})();
