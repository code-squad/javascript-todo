const Parser = require('./parser');

const numberCheck = id => typeof id === 'number' && !Number.isNaN(id);

function checkIsArrayLiteral(str){
  try{
    return Array.isArray(JSON.parse(str));
  } catch(err){
    return false;
  }
}

function checkValidStatus(status){
  const availableStatus = ['all', 'todo', 'doing', 'done'];
  return availableStatus.indexOf(status) !== -1;
}

const TodoParser = function(delimiter){
  Parser.call(this, delimiter);
};

TodoParser.prototype = Object.create(Parser.prototype);


TodoParser.prototype.checkUpdateCommand = function(id, status){
    if( !numberCheck(id) || (status === undefined)) {
      throw new Error('Update 명령에는 id와 status가 필요합니다.');
    }
    if( !checkValidStatus(status) ){
      throw new Error('사용할 수 없는 상태값입니다.');
    }
  };

TodoParser.prototype.checkAddCommand = function(name, tag, status){
    if( name === undefined || tag === undefined || status === undefined) {
      throw new Error('Add 명령에는 name, tag, status가 필요합니다.');
    }
    if( !checkIsArrayLiteral(tag)){
      throw new Error('Tag는 JavaScript 배열 형태여야 합니다.');
    }
    if( !checkValidStatus(status) ){
      throw new Error('사용할 수 없는 상태값입니다.');
    }
  };

TodoParser.prototype.checkShowCommand = function(status){
    const availableStatus = ['all', 'todo', 'doing', 'done'];
    if( !checkValidStatus(status) ){
      throw new Error('사용할 수 없는 상태값입니다.');
    }
  };

TodoParser.prototype.checkDeleteCommand = function(id){
    if( !numberCheck(id)){
      throw new Error('Delete 명령에는 id와 status가 필요합니다.');
    }
  };

TodoParser.prototype.checkSingleCommand = function(line){
  const singleCommands = ['undo', 'redo'];
  return singleCommands.some(command => command === line);
}

TodoParser.prototype.parsing = function(line){ 
    const parsedLine = this.checkSingleCommand(line) ? [ line ] : Parser.prototype.parsing.call(this, line);
    const command = parsedLine[0];
    const args = parsedLine.splice(1);

    switch(command){
      case 'update':
        args[0] = Number.parseInt(args[0]);
        this.checkUpdateCommand(...args);
        break;
      case 'show':
        this.checkShowCommand(...args);
        break;
      case 'delete':
        args[0] = Number.parseInt(args[0]);
        this.checkDeleteCommand(...args);
        break;
      case 'add':
        this.checkAddCommand(...args);
        break;
      case 'undo':
      case 'redo':
        break;
      default:
        throw new Error('존재하지 않는 명령입니다.');
    }
    return {
      command,
      args,
    };
};

module.exports = TodoParser;