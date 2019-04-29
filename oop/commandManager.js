class CommandManager {
    constructor(addManager, deleteManager, updateManager) {
        this.addManager = addManager;
        this.deleteManager = deleteManager;
        this.updateManager = updateManager;
        this.commandStack = [];
        this.commandPointer = 0;
    }
    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        let status, name, tag, id;
        let resultData;

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
        this.commandPointer--;
        const command = this.commandStack[this.commandPointer];
        let undoObj;
        switch(command) {
            case 'add' :
                undoObj = this.addManager.undo();
                return [command, undoObj];
            case 'delete' :
                undoObj = this.deleteManager.undo();
                return [command, undoObj];
            case 'update' :
                undoObj = this.updateManager.undo();
                return [command, undoObj];
        }
    }
}

module.exports = CommandManager;