const fs = require('fs');

const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))


const TodoHandler = function (todoChecker, resultMsg) { 
  this.todoChecker = todoChecker
  this.resultMsg = resultMsg
}


TodoHandler.prototype = {
  save: function (){
    let data = JSON.stringify(todos)
    fs.writeFileSync("data.json" ,data)
    return
  },
  createId: function (name) {
    let charCode = 0
    let timeNow = new Date().getTime()
    for(let i = 0; i<name.length;i++){
        charCode += name.charCodeAt(i)
    }
    return charCode + timeNow
  },
  makeTodo: function(name, id, tags, status = "todo") {
    return {
      name: name,
      status: status,
      id: id,
      tags: tags
    }
  },
  countByStatus : function(){
    let todoCount = todos.filter(v => v.status === 'todo').length
    let doingCount = todos.filter(v => v.status === 'doing').length
    let doneCount = todos.length - todoCount - doingCount
    return {'todo' : todoCount, 'doing' : doingCount, 'done' : doneCount}
  },


  add : async function(name, tags){
    tags = JSON.parse(tags)
    const id = this.createId(name)

    todos.push(this.makeTodo(name, id, tags))
    console.log(this.resultMsg.addMsg(name, id))
    await sleep(1000)
    this.save()
    this.show('all')
    return
  },
  update : async function(id, statusToChange){
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
  } ,
  delete : async function(id) {
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
  },
  show : function(option) {
    const counted = this.countByStatus()
    if (option === 'all'){
      console.log(this.resultMsg.showAllMsg(counted)) 
      return
    }
    result = todos.filter(v => v.status === option).map(v => v.name)
    console.log(this.resultMsg.showStatus(result, option, counted)) 
    return 
  },
}

module.exports = TodoHandler;