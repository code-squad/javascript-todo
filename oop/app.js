const readLine = require('readline').createInterface( {
	input:process.stdin,
	output:process.stdout,
});

function Program() {
}

Program.prototype = {

    runProgram : (readline) => {
       readline.setPrompt('명령하세요: ');
       readline.prompt();
       readline.on('line', (userInput) => {	           

        const cmdList = CommandParser.prototype.getCmdList(userInput);
        CommandParser.prototype.executeCmd(cmdList);
        
        readLine.prompt();

    }).on('close', () => {
           console.log("프로그램을 종료합니다.");
           process.exit();
       });
   }

};


const run = (() => {
	const program = new Program();
	program.runProgram(readLine);
})();