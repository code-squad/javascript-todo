class Parser {
  constructor(delimiter_){
    this.delimiter = delimiter_;
  }

  parsing(line){
    if(line.indexOf(this.delimiter) === -1) {
      throw new Error(`${this.delimiter}가 없습니다.`);
    }
    return line.split(this.delimiter);
  }
}

module.exports = Parser;