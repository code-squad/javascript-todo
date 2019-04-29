class CommandManager {
    constructor(validation) {
        this.validation = validation;
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
                name = inputArray[1];
                tag = inputArray[2];
                resultData = commandObj.execute(name, tag);
                break;
            case 'delete':
                id = inputArray[1];
                //if (!this.validation.notExistIdErrorCheck(id)) return;
                resultData = commandObj.execute(id);
                break;
            case 'update':
                id = inputArray[1];
                status = inputArray[2];
                //if (!this.validation.notExistIdErrorCheck(id)) return;
                //if (!this.validation.sameStatusErrorCheck(id, status)) return;
                resultData = commandObj.execute(id, status);
                break;
        }
        return resultData;
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