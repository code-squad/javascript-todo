class CommandManager {
    constructor(addCommand, deleteCommand, updateCommand) {
        this.addCommand = addCommand;
        this.deleteCommand = deleteCommand;
        this.updateCommand = updateCommand;
        this.commandQueue = [];
        this.commandPointer = -1;
        this.undoQueue = [];
        this.undoPointer = -1;
    }

    manageQueue(command) {
        if (this.commandQueue.length >= 3) {
            this.commandQueue.shift();
            this.commandPointer--;
            switch(command) {
                case 'add': 
                    this.addCommand.historyQueue.shift();
                    this.addCommand.historyPointer--; 
                    break;
                case 'delete':
                    this.deleteCommand.historyQueue.shift();
                    this.deleteCommand.historyPointer--; 
                    break;
                case 'update':
                    this.updateCommand.historyQueue.shift();
                    this.updateCommand.historyPointer--; 
                    break;
            }
        }
    }

    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        let status, name, tag, id;
        let resultData;

        if (this.undoQueue.length !== 0) {
            this.undoQueue = [];
            this.undoPointer = -1;
        }

        if (command !== 'show') 
            this.manageQueue(command);

        switch(command) {
            case 'show' :
                status = inputArray[1];
                resultData = commandObj.execute(status);
                break;
            case 'add' :
                this.commandQueue.push('add');
                this.commandPointer++;
                name = inputArray[1];
                tag = inputArray[2];
                resultData = commandObj.execute(name, tag);
                break;
            case 'delete':
                this.commandQueue.push('delete');
                this.commandPointer++;
                id = inputArray[1];
                resultData = commandObj.execute(id);
                break;
            case 'update':
                this.commandQueue.push('update');
                this.commandPointer++;
                id = inputArray[1];
                status = inputArray[2];
                resultData = commandObj.execute(id, status);
                break;
        }
        return resultData;
    }

    undo() {
        const command = this.commandQueue[this.commandPointer--];
        this.commandQueue.pop();
        let undoObj;
        switch(command) {
            case 'add' :
                this.undoQueue.push('add');
                this.undoPointer++;
                undoObj = this.addCommand.undo();
                return [command, undoObj];
            case 'delete' :
                this.undoQueue.push('delete');
                this.undoPointer++;
                undoObj = this.deleteCommand.undo();
                return [command, undoObj];
            case 'update' :
                this.undoQueue.push('update');
                this.undoPointer++;
                undoObj = this.updateCommand.undo();
                return [command, undoObj];
        }
    }

    redo() {
        const command = this.undoQueue[this.undoPointer--];
        let redoObj;
        switch(command) {
            case 'add' :
                redoObj = this.addCommand.redo();
                return [command, redoObj];
            case 'delete' :
                redoObj = this.deleteCommand.redo();
                return [command, redoObj];
            case 'update' :
                redoObj = this.updateCommand.redo();
                return [command, redoObj];
        }
    }
}

module.exports = CommandManager;