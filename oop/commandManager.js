class CommandManager {
    constructor(addManager, deleteManager, updateManager) {
        this.addManager = addManager;
        this.deleteManager = deleteManager;
        this.updateManager = updateManager;
        this.commandStack = [];
        this.commandPointer = -1;
        this.undoStack = [];
        this.undoStackPointer = -1;
    }

    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        let status, name, tag, id;
        let resultData;

        if (this.undoStack.length !== 0) {
            this.undoStack = [];
            this.undoStackPointer = -1;
        }

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
                undoObj = this.addManager.undo();
                return [command, undoObj];
            case 'delete' :
                this.undoStack.push('delete');
                this.undoStackPointer++;
                undoObj = this.deleteManager.undo();
                return [command, undoObj];
            case 'update' :
                this.undoStack.push('update');
                this.undoStackPointer++;
                undoObj = this.updateManager.undo();
                return [command, undoObj];
        }
    }

    redo() {
        const command = this.undoStack[this.undoStackPointer--];
        let redoObj;
        switch(command) {
            case 'add' :
                redoObj = this.addManager.redo();
                return [command, redoObj];
            case 'delete' :
                redoObj = this.deleteManager.redo();
                return [command, redoObj];
            case 'update' :
                redoObj = this.updateManager.redo();
                return [command, redoObj];
        }
    }
}

module.exports = CommandManager;