class CommandManager {
    constructor(addCommand, deleteCommand, updateCommand) {
        this.addCommand = addCommand;
        this.deleteCommand = deleteCommand;
        this.updateCommand = updateCommand;
        this.commandStack = [];
        this.commandPointer = -1;
        this.undoStack = [];
        this.undoStackPointer = -1;
    }

    manageQueue(command) {
        if (this.commandStack.length >= 3) {
            this.commandStack.shift();
            this.commandPointer--;
            switch(command) {
                case 'add': 
                    this.addCommand.historyStack.shift();
                    this.addCommand.historyStackPointer--; 
                    break;
                case 'delete':
                    this.deleteCommand.historyStackPointer--; 
                    this.deleteCommand.historyStack.shift();
                    break;
                case 'update':
                    this.updateCommand.historyStackPointer--; 
                    this.updateCommand.historyStack.shift();
                    break;
            }
        }
    }

    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        let status, name, tag, id;
        let resultData;

        if (this.undoStack.length !== 0) {
            this.undoStack = [];
            this.undoStackPointer = -1;
        }

        if (command !== 'show') 
            this.manageQueue(command);

        switch(command) {
            case 'show' :
                status = inputArray[1];
                resultData = commandObj.execute(status);
                break;
            case 'add' :
                this.commandStack.push('add');
                this.commandPointer++;
                name = inputArray[1];
                tag = inputArray[2];
                resultData = commandObj.execute(name, tag);
                break;
            case 'delete':
                this.commandStack.push('delete');
                this.commandPointer++;
                id = inputArray[1];
                resultData = commandObj.execute(id);
                break;
            case 'update':
                this.commandStack.push('update');
                this.commandPointer++;
                id = inputArray[1];
                status = inputArray[2];
                resultData = commandObj.execute(id, status);
                break;
        }
        return resultData;
    }

    undo() {
        const command = this.commandStack[this.commandPointer--];
        this.commandStack.pop();
        let undoObj;
        switch(command) {
            case 'add' :
                this.undoStack.push('add');
                this.undoStackPointer++;
                undoObj = this.addCommand.undo();
                return [command, undoObj];
            case 'delete' :
                this.undoStack.push('delete');
                this.undoStackPointer++;
                undoObj = this.deleteCommand.undo();
                return [command, undoObj];
            case 'update' :
                this.undoStack.push('update');
                this.undoStackPointer++;
                undoObj = this.updateCommand.undo();
                return [command, undoObj];
        }
    }

    redo() {
        const command = this.undoStack[this.undoStackPointer--];
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