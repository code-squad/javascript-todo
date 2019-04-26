const Parser = function(delimiter_){
  this.delimiter = delimiter_;
};

Parser.prototype = {
  parsing: function(line){
    if(line.indexOf(this.delimiter) === -1) {
      throw new Error(`${this.delimiter}가 없습니다.`);
    }
    return line.split(this.delimiter); 
  },
}

module.exports = Parser;