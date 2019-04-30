const fs = require('fs');

const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))


class TodoHandler  { 
  constructor(todoGetter, resultMsg){
    this.todoGetter = todoGetter;
    this.resultMsg = resultMsg;
    this.history = {
      undo: [],
      redo: [],
      checkStackCount: function (stack, maxLength){
        if(stack.length === maxLength) return true
        return false
      },
      append: function (command, todo){
        if(this.checkStackCount(this.undo, 3)){
          this.undo.shift()
          this.undo.push({command, todo})
          return
        }
        this.undo.push({command, todo})
      }
    }
  }
  save(){
    let data = JSON.stringify(todos)
    fs.writeFileSync("data.json" ,data)
    return
  }
  createId (name) {
    let charCode = 0
    let timeNow = new Date().getTime()
    for(let i = 0; i<name.length;i++){
        charCode += name.charCodeAt(i)
    }
    return charCode + timeNow
  }
  makeTodo (name, id, tags, status = "todo") {
    return {
      name: name,
      status: status,
      id: id*1,
      tags: tags
    }
  }
  countByStatus (){
    let todoCount = todos.filter(v => v.status === 'todo').length
    let doingCount = todos.filter(v => v.status === 'doing').length
    let doneCount = todos.length - todoCount - doingCount
    return {'todo' : todoCount, 'doing' : doingCount, 'done' : doneCount}
  }


  async add (name, tags){
    tags = JSON.parse(tags)
    const id = this.createId(name)
    const newTodo = this.makeTodo(name, id, tags)
    todos.push(newTodo)
    console.log(this.resultMsg.addMsg(name, id))
    this.save()
    this.history.append('add', newTodo)
    await sleep(1000)
    this.show('all')
    return
  }
  async update (id, statusToChange){
    try{
      let todo = this.todoGetter.getTodoById(todos, id)
      let {name, tags, status} = todo
      this.todoGetter.isValidStatus(statusToChange, status)

      const index = this.todoGetter.getTodoIndex(todos, id)
      this.history.append('update', todos[index])
      todos.splice(index, 1, this.makeTodo(name, id, tags, statusToChange,))
      this.save()
      
      await sleep(3000)
      console.log(this.resultMsg.updateMsg(name, statusToChange)) 
      await sleep(1000)
      this.show('all')
      
      return
    } catch(e){
      console.log(e.message)
    }
  } 
  async delete (id) {
    try{
      let index = this.todoGetter.getTodoIndex(todos, id)
      console.log(this.resultMsg.deleteMsg(todos[index].name, todos[index].status))
      this.history.append('delete', todos[index])
      await(sleep(1000))
      todos.splice(index, 1)
      this.show('all')
      this.save()
    } catch (e){
      console.log(e.message)
    }
  }
  show (option) {
    const counted = this.countByStatus()
    if (option === 'all'){
      console.log(this.resultMsg.showAllMsg(counted)) 
      return
    }
    result = todos.filter(v => v.status === option).map(v => v.name)
    console.log(this.resultMsg.showStatus(result, option, counted)) 
    return 
  }

  undo () {
    const {command, todo} = this.todoRedoExec('undo')
    this.history.redo.push({command, todo})
  }
  redo () {
    const {command, todo} = this.todoRedoExec('redo')
    this.history.append(command, todo)
  }
  todoRedoExec (undoOrRedo) {
    if (this.history.checkStackCount(this.history[undoOrRedo], 0)) throw new Error("이전에 undo 를 실행하지 않았습니다.")
    let {command, todo} = this.history[undoOrRedo].pop()

    if(command === "add" && undoOrRedo === 'undo' || command === "delete" && undoOrRedo === 'redo'){
      const index = this.todoGetter.getTodoIndex(todos, todo.id)
      todos.splice(index, 1);
      console.log(this.resultMsg.resultOfUndoRedo({
        id: todo.id,
        name: todo.name,
        command: command,
        undoOrRedo: undoOrRedo
      }))
    }
    if(command === "update"){
      const index = this.todoGetter.getTodoIndex(todos, todo.id)
      const todoFromData = todos[index]
      todos.splice(index, 1, todo);
      console.log(this.resultMsg.resultOfUndoRedo({
        id: todo.id, 
        name: todo.name, 
        currentStatus: todoFromData.status, 
        postStatus: todo.status
      })) 
      todo = todoFromData
    }
    if(command === "delete" && undoOrRedo === 'undo' || command === "add" && undoOrRedo === 'redo'){
      todos.push(todo);
      console.log(this.resultMsg.resultOfUndoRedo({
        id: todo.id,
        name: todo.name,
        command: command,
        undoOrRedo: undoOrRedo
      }))
    }
    return {command, todo}
  }
}

module.exports = TodoHandler;