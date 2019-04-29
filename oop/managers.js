module.exports = class Managers {
    constructor(model, printer) {
        this.model = model;
        this.printer = printer;
}
 show = {
    'execute' : function (status) {
                    if(status === 'all') {
                        const countEachStatus = this.model.getCountEachStatus();
                        this.printer.printShowAllMessage(countEachStatus);
                        return;
                    }
                    const listInStatus = this.model.getListInStatus(status);
                    this.printer.printShowStatusMessage(status, listInStatus);
                }
}
}
    // 'commandManger' : {

    // },

    
    
    // 'addManger' : {
        
    // },

    // 'deleteManger' : {
        
    // },

    // 'updateManger' : {
        
    // },
