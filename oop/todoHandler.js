const fs = require('fs');

const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))


class TodoHandler  { 
  constructor(todoChecker, resultMsg){
    this.todoChecker = todoChecker
    this.resultMsg = resultMsg
    this.history = {
      undo: {
        commands: ['delete', 'update', 'add'],
        todoStack: [    
        {
          "name": "자바스크립트 배우기",
          "id": 1555639875203,
          "tags": [
              "javascript",
              "react",
              "nodejs"
          ],
          "status": "doing"
        },
        {
          "name": "코틀린배우기",
          "tags": [
              "java",
              "코드량 줄어듬"
          ],
          "status": "todo",
          "id": 1555639759007
        },
        {
          "name": "잠자기",
          "id": 1555639627186,
          "tags": [
              "8시간",
              "7시기상"
          ],
          "status": "done"
         }
        ],
      },
      redo: {
        commands: [],
        todoStack: [],
      },
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
      id: id,
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

    todos.push(this.makeTodo(name, id, tags))
    console.log(this.resultMsg.addMsg(name, id))
    await sleep(1000)
    this.save()
    this.show('all')
    return
  }
  async update (id, statusToChange){
    try{
      let todo = this.todoChecker.getTodoById(todos, id)
      let {name, tags, status} = todo
      this.todoChecker.isValidStatus(statusToChange, status)

      const index = this.todoChecker.getTodoIndex(todos, id)
      todos.splice(index, 1, this.makeTodo(name, id, tags, statusToChange,))

      await sleep(3000)
      console.log(this.resultMsg.updateMsg(name, statusToChange)) 
      await sleep(1000)

      this.show('all')
      this.save()
      return
    } catch(e){
      console.log(e.message)
    }
  } 
  async delete (id) {
    try{
      let index = this.todoChecker.getTodoIndex(todos, id)
      console.log(this.resultMsg.deleteMsg(todos[index].name, todos[index].status))
      await(sleep)
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
    const command = this.history.undo.commands.pop()
    let todo = this.history.undo.todoStack.pop()
    const index = this.todoChecker.getTodoIndex(todos, todo.id)
    const modifiedTodo = todos[index]
    if(command === "add"){
      todos.splice(index, 1);
      console.log(`${todo.id}번 항목 '${todo.name}' ${command} 가 취소되었습니다.`)
    }
    if(command === "update"){
      todos.splice(index, 1, todo);
      console.log(`${todo.id}번 항목 '${todo.name}의 상태가 ${modifiedTodo.status}에서 ${todo.status}로 변경되었습니다.`)
      todo = modifiedTodo
    }
    if(command === "delete"){
      todos.push(todo);
      console.log(`${todo.id}번 항목 '${todo.name}'의 ${command} 가 취소되었습니다.`)
    }
    this.history.redo.todoStack.push(todo)
    this.history.redo.commands.push(command)
    
    //console.log(command, todo)
  }
  redo () {
    console.log('redo')
    const command = this.history.redo.commands.pop()
    const todo = this.history.redo.todoStack.pop()
    let index
    console.log(command, todo)
    if(command === 'add'){
      todos.push(todo)
      console.log(`${todo.id}번 항목 '${todo.name}'가 다시 ${command}되었습니다.`)
    }
    if(command === 'update'){
      index = this.todoChecker.getTodoIndex(todos, todo.id)
      const originalTodo = todos[index]
      todos.splice(index, 1, todo)
      console.log(`${todo.id}번 항목 '${todo.name}'의 상태가 ${originalTodo.status}에서 ${todo.status}로 변경되었습니다.`)
    }
    if(command === 'delete'){
      index = this.todoChecker.getTodoIndex(todos, todo.id)
      todos.splice(index, 1)
      console.log(`${todo.id}번 항목 '${todo.name}' ${command} 가 다시 ${command}되었습니다.`)
    }
  }
}

module.exports = TodoHandler;