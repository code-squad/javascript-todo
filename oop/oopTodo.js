const TodoUI = function() {};

TodoUI.prototype.addTodoExecutor = function(todoElement, todoTag) {
    addTodoList(todoElement, todoTag);
}

TodoUI.prototype.addTodoList = function(todoElement, todoTag) {
    let listFormat = {};
    listFormat.name = todoElement;
    list.tag = Array(`${todoTag}`);
    list.status = "todo";
    list.id = parseInt(Math.random() * 10000);
    datalist.push(format);

    return addTodoResult(listFormat);
}

