const controlCommand = require('./Step4_2_control_command');
const readLine = require('readline');

const rl = readLine.createInterface( {
    input:process.stdin,
    output:process.stdout,
} );

( () => {

    rl.setPrompt('명령하세요 : ');
    rl.prompt();
    rl.on( 'line', (query) => {
        if (query === 'exit') rl.close();
        const splitQuery = query.replace(/\s/gi, "").split('$');
        const executionCommand = splitQuery[0];
        const nonCommand = splitQuery.splice(1);
        const isComplete = controlCommand(executionCommand, nonCommand);

        if (isComplete) {
            let millisecond = 1000;
            if (executionCommand === 'update') millisecond = 4010;
            else if (executionCommand === 'show') millisecond = 0;
            setTimeout( () => { rl.prompt(); },  millisecond );
        } else {
            rl.prompt();
        }
    } ).on( 'close', () => { process.exit(); } );

} )();