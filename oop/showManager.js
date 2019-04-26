class ShowManager {
    constructor(model, printer) {
        this.model = model;
        this.printer = printer;
    }

    execute (status) {
        if(status === 'all') {
            const countEachStatus = this.model.getCountEachStatus();
            this.printer.printShowAllMessage(countEachStatus);
            return;
        }
        const listInStatus = this.model.getListInStatus(status);
        this.printer.printShowStatusMessage(status, listInStatus);
    }
}

module.exports = ShowManager;