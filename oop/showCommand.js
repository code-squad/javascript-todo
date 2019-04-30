const Command = require('./command');

class ShowCommand extends Command {
    execute (status) {
        if(status === 'all') {
            const countEachStatus = this.model.getCountEachStatus();
            return [status, countEachStatus];
        }
        const listInStatus = this.model.getListInStatus(status);
        return [status, listInStatus];
    }
}

module.exports = ShowCommand;