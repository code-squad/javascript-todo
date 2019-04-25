function CommandParser () {
	
}

CommandParser.prototype = {
	getCmdList : (input) => {
    const regexp = /[^\$]+/g;
    return input.match(regexp);
	},
};

module.exports = CommandParser;

