class TodoUtil {
    parseCommand(command) {
        if (command === 'undo' || command === 'redo') return [command];
        if (!/\$/.test(command)) throw Error('DollarCharError');
        return command.split('$');
    }

    getKeyCommand(command) {
        const keyMap = {
            'show': 'showData',
            'add': 'addData',
            'delete': 'deleteData',
            'update': 'updateData',
            'undo': 'undo',
            'redo': 'redo'
        }
        const keyCommand = command.shift();
        return keyMap[keyCommand];
    }

    checkArgsNumber(keyCommand, restCommand) {
        const argsNumber = {
            showData: 1,
            addData: 2,
            deleteData: 1,
            updateData: 2,
            undo: 0,
            redo: 0
        }
        if (argsNumber[keyCommand] !== restCommand.length) throw Error('ArgsNumberError');
    }
}

module.exports = TodoUtil;