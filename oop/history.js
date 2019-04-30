
module.exports = {
    list: [],
    maxLength: 4,
    pointer: 0,
    recordTodo: function(todoList) {
        this.list[this.pointer]={
            todoList: JSON.parse(JSON.stringify([...todoList])),
        }
        if(this.pointer === this.maxLength - 1) {
            this.list.shift()
        } else {
            this.pointer++
        }
        this.list.length = this.pointer
    },
    undo: function(todoList){
        if (this.pointer <= 0) {
            throw Error("NO_MORE_UNDO")
        }
        if(this.pointer === this.list.length){
            this.list[this.pointer]={
                todoList: JSON.parse(JSON.stringify([...todoList])),
            }
        }
        this.pointer--
        return this.list[this.pointer]
    },
    redo: function(){
        if(this.pointer >= this.maxLength || this.pointer + 1 >= this.list.length) {
            throw Error("NO_MORE_REDO")
        }
        this.pointer++
        return this.list[this.pointer]
    }
}