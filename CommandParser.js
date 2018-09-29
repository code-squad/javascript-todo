class CommandParser {
  constructor(command) {
    this.command = command;
    this.parsedCommand = [];
  }

  split(unit) {
    this.parsedCommand = this.command.split(unit);
    return this;
  }

  trim() {
    this.parsedCommand = this.parsedCommand.map(value => value.trim());
    return this;
  }

  parseCommand(unit) {
    this.split(unit).trim();
    return this.parsedCommand;
  }
}

module.exports = CommandParser;