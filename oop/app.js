const readLine = require('readline').createInterface( {
	input:process.stdin,
	output:process.stdout,
});
const CommandParser = require('./commandParser.js');
const Utils = require('./utils.js');
const Instruction = require('./instruction.js');
const ExceptionHandling = require('./exceptionHandling.js');

function Program() {
	this.cmdArr = ['show','delete','update','add'];
}

Program.prototype = {

    runProgram : (readline, cmdArr) => {
       readline.setPrompt('명령하세요: ');
       readline.prompt();
       readline.on('line', (userInput) => {	    

        try {
				
            if (!ExceptionHandling.prototype.isValidSeperator(userInput)) {ExceptionHandling.prototype.missingSeperatorException();}
            const cmdList = CommandParser.prototype.getCmdList(userInput);
            
            if (!CommandParser.prototype.isValidCommand(cmdList[0], cmdArr)) {ExceptionHandling.prototype.CommandMissingException();}
            
            CommandParser.prototype.executeCmd(cmdList);

            Utils.prototype.delay(0)
            .then(() => {if (cmdList[0] === 'update') return Utils.prototype.delay(3500);})
            .then(() => {return Utils.prototype.delay(1000);})
            .then(() => {if (cmdList[0] !== 'show') Instruction.prototype.show('all');})
            .catch(function(e) {console.log(e);})
            .then(() => {readLine.prompt();});
        
        } catch(e) {
            console.error(e.message);
            readLine.prompt();
        }

    }).on('close', () => {
           console.log("프로그램을 종료합니다.");
           process.exit();
       });
   }

};


const run = (() => {
	const program = new Program();
	program.runProgram(readLine, program.cmdArr);
})();