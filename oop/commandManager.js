class CommandManager {
    constructor() {
    }
    executeCommand(inputArray, commandObj) {
        const command = inputArray[0];
        let resultData;
        switch(command) {
            case 'show' :
                const statusShow = inputArray[1];
                resultData = commandObj.execute(statusShow);
                return resultData;
            case 'add' :
                const name = inputArray[1];
                const tag = inputArray[2];
                resultData = commandObj.execute(name, tag);
                return resultData;
            case 'delete':
                const id = inputArray[1];
                commandObj.execute(id);
                break;
            // case 'update':
            //     const id = inputArray[1];
            //     const status = inputArray[2];
            //     commandObj.execute(id, status);
            //     break;
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