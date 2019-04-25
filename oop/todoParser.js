const Parser = require('./parser');

const numberCheck = id => typeof id === 'number' && !Number.isNaN(id)

class TodoParser extends Parser {
  constructor(delimiter){
    super(delimiter);
  }

  checkUpdateCommand(id, status){
    if( !numberCheck(id) || (status === undefined)) {
      throw new Error('Update 명령에는 id와 status가 필요합니다.');
    }
  }

  checkAddCommand(name, status){
    if( name === undefined || (status === undefined)) {
      throw new Error('Add 명령에는 name과 status가 필요합니다.');
    }
  }

  checkShowCommand(status){
    const availableStatus = ['all', 'todo', 'doing', 'done'];
    if( availableStatus.indexOf(status) === -1){
      throw new Error(`Show로 검색할 수 있는 값은 ${availableStatus.join(', ')} 입니다.`);
    }
  }

  checkDeleteCommand(id){
    if( !numberCheck(id)){
      throw new Error('Delete 명령에는 id와 status가 필요합니다.');
    }
  }

  parsing(line){ 
      const parsedLine = super.parsing(line);
      const command = parsedLine[0].toLowerCase();
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
        default:
          throw new Error('존재하지 않는 명령입니다.');
      }
      return {
        command,
        args,
      };
  }
}

module.exports = TodoParser;