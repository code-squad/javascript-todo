const todoList = require('./data.js');
const Print = require('./todoPrint.js');

const todoMainMethod = function() {}

todoMainMethod.prototype.todoCount = function () {
    const status = ['todo', 'doing', 'done'];
    const statusLength=[]
    const reducer = (accumulator, currentValue) => {
        var answer = todoList.filter(v => v.status === currentValue).length;
        statusLength.push(answer)
        return answer;
    }
    status.reduce(reducer,0);
    
    Print.ShowPrint.printShowAll(statusLength[0],statusLength[1],statusLength[2]);
}

todoMainMethod.prototype.todoShowElse = function(input) {
    let temp = todoList.filter(v => v.status === input).map((obj)=>{ return ` '${obj.name}, ${obj.id}번'`})
    Print.ShowPrint.printShowElse(temp.length, temp);
}

todoMainMethod.prototype.todoForm = function (name, tag, status, id) {
    this.name = name;
    this.tag = [tag];
    this.status = status;
    this.id = id;
}


todoMainMethod.prototype.makingID = function(){
    return Math.floor(Math.random() * 10000);
}


todoMainMethod.prototype.findDataIdObj = function(input){
    let target = todoList.filter(v => v["id"] === input);
    let targetName = target[0].name;
    let targetIdx = todoList.indexOf(target[0]);    
    return [targetIdx, targetName];
}



module.exports = {
    todoMainMethod
}