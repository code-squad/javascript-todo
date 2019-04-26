const readLine = require('readline').createInterface( {
	input:process.stdin,
	output:process.stdout,
});
const CommandParser = require('./commandParser.js');
const Utils = require('./utils.js');
const Instruction = require('./instruction.js');
const CustomException = require('./CustomException.js');

function RunTodoApp() {
    this.cmdArr = ['show','delete','update','add'];
    this.commandParser = new CommandParser();
	this.utils = new Utils();
	this.instruction = new Instruction();
	this.customException = new CustomException();
}

RunTodoApp.prototype = {

    runProgram (readline) {
       readline.setPrompt('명령하세요: ');
       readline.prompt();
       readline.on('line', (userInput) => {	    

        try {
           
            this.customException.missingSeperatorException(userInput);
            const cmdList = this.commandParser.getCmdList(userInput);
            
            this.customException.CommandMissingException(cmdList[0], this.cmdArr);
            this.commandParser.executeCmd(cmdList);

            this.utils.delay(0)
            .then(() => {if (cmdList[0] === 'update') return this.utils.delay(3500);})
            .then(() => {return this.utils.delay(1000);})
            .then(() => {if (cmdList[0] !== 'show') this.instruction.show('all');})
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
	const runTodoApp = new RunTodoApp();
	runTodoApp.runProgram(readLine);
})();