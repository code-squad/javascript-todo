class CommandManager {
    constructor() {
    }
    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        //this.managers[command].execute(inputArray[1]);
        switch(command) {
            case 'show' :
                const statusShow = inputArray[1];
                commandObj.execute(statusShow);
                break;
            case 'add' :
                const name = inputArray[1];
                const tag = inputArray[2];
                commandObj.execute(name, tag);
                break;
        }
    }
}

module.exports = CommandManager;
    
    //     case 'delete' :
    //         const idDelete = inputArray[1];
    //         if(!(this.errorHandler.notExistIdErrorCheck(idDelete))) return;
    //         this.delete(idDelete);
    //         break;
    //     case 'update' :
    //         const idUpdate = inputArray[1];
    //         const statusUpdate = inputArray[2];
    //         if(!(this.errorHandler.notExistIdErrorCheck(idUpdate))) return;
    //         if(!(this.errorHandler.sameStatusErrorCheck(idUpdate, statusUpdate))) return;
    //         this.update(idUpdate, statusUpdate);
    //         break;
    // }