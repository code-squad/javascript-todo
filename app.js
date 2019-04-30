const readline = require('readline').createInterface( {
	input:process.stdin,
	output:process.stdout,
});

const CommandParser = require('./commandParser.js');
const Utils = require('./utils.js');
const Instruction = require('./instruction.js');
const customException = require('./customException.js');

const cmdArr = ['show','delete','update','add','undo','redo'];
const commandParser = new CommandParser();
const utils = new Utils();
const instruction = new Instruction();

const run = (() => {
    readline.setPrompt('명령하세요: ');
    readline.prompt();
    readline.on('line', (userInput) => {
    
    try {
        customException.missingSeperatorException(userInput);
	const cmdList = commandParser.getCmdList(userInput);

	customException.CommandMissingException(cmdList[0], cmdArr);
	commandParser.executeCmd(cmdList);

	utils.delay(0)
	.then(() => {if (cmdList[0] === 'update') return utils.delay(3500);})
	.then(() => {return utils.delay(1000);})
	.then(() => {if (cmdList[0] !== 'show') instruction.show('all');})
	.catch(function(e) {console.log(e);})
	.then(() => {readline.prompt();});

    } catch(e) {
	console.error(e.message);
	readline.prompt();
    }

}).on('close', () => {
   console.log("프로그램을 종료합니다.");
   process.exit();
   });
})();
