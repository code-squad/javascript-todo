const checkparamArr = (command, paramArr) => { 
    switch(command) {
        case 'show': case 'delete': return paramArr.length === 1;
        case 'add':  case 'update': return paramArr.length === 2;
    }
}

const checkCommand = (currentCommand) => {
    return ['show', 'add', 'delete', 'update'].some( (command) => { return currentCommand === command } );
}

const checkStatus = (currentStatus) => {
    return ['all', 'todo', 'doing', 'done'].some( (status) => { return currentStatus === status } );
}

const checkIdForm = (id) => { return isNaN(id) ? false : true; }

const checkTagForm = (tag) => { return tag.match(/(?<=\[\")[a-z]*(?=\"\])/i) !== null; }

module.exports = {
    checkparamArr,
    checkCommand,
    checkStatus,
    checkIdForm,
    checkTagForm,
}