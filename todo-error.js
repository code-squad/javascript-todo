const TodoError = function() {

}

TodoError.prototype.findSeparator = function(action, input) {
    const splitOfInput = input.split('');

    if(action === 'add' || action === 'update') {
        const countComma = splitOfInput.filter(n => {
            return n === ','
        })
        return countComma.length === 2 ? true : false
    }
    if (action === 'delete' || action == 'show') {
        const countComma = splitOfInput.filter(n => {
            return n === ','
        })
        return countComma.length === 1 ? true : false
    }
    
}